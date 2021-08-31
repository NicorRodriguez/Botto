const constants = require('./constants')

const Puppeteer = require('./puppeteer')
const RedmineLogic = require('./redmineLogic')
const Comparator = require('./comparator')
const SlackFunctions = require('./slackFunctions')
const Requests = require('./requests')

import { RTMClient } from '@slack/rtm-api'


const rtm = new RTMClient(constants.SLACK_BOT_AUTH)

rtm.start().catch(console.error);

rtm.on('ready', async()=>{
  console.log('Bot inicializado.')
});

rtm.on('slack_event', async(eventType, event)=>{
  if(event && eventType === 'message'){
    const message = event.text.split(" ");
    const ch = event.channel

    if(message!=null && message[0]!=null && message[0]=='<@U02BHTQ6RFH>'){ //unicamente accede si la primer palabra del mensaje es una mencion al bot
      try {

        if(message[1]!=null && Comparator.proximity(message[1], 'buscar')){ //unicamente accede si la segunda palabra del mensaje es proximo a buscar
        
          if(Comparator.proximity(message[2], 'proyecto')){ //lee la tercer palabra del mensaje y compara si es relativo a proyecto
  
            //obtiene el nombre del proyecto ingresado por el usuario
            var proy =message[3]
            for (let k = 4; k < message.length; k++) proy=proy+'_'+message[k]

            if(proy!=null){

              //obtiene todos los proyectos disponibles en el servidor de redmine
              const myprojects = await RedmineLogic.projects()
              var proyFind = false

              //chequea que el proyecto ingresado sea similar a alguno de los proyectos de redmine
              for (let i=0; i<myprojects.length && !proyFind; i++)
                if(Comparator.proximity(proy, myprojects[i])){
                  proyFind=true
                  proy=myprojects[i]
                }
              
              if(proyFind){ //corrobora que haya encontrado algun proyecto similar al ingresado
                
                //obtiene todos los issues disponibles dentro del proyecto
                const myarr = await RedmineLogic.project(proy)
  
                //corrobora que existan issues dentro de ese proyecto
                if (myarr.length!=0){

                  var mystr = ''
                  for(let i=0; i<myarr.length; i++){
                    mystr=mystr+' '+myarr[i]
                  };

                  SlackFunctions.sendMsg(ch, 'Estos son los issues en '+proy+' disponibles:'+mystr)

                }else{ SlackFunctions.sendMsg(ch, 'No existen issues en '+proy+'.') }

              }else SlackFunctions.error(ch)
  
            }else SlackFunctions.sendMsg(ch, 'El proyecto que ingreso no pertenece a la base de datos.')
  
          } else if(Comparator.proximity(message[2], 'proyectos')){ //lee la tercer palabra del mensaje y compara si es relativo a proyectos
            
            //obtiene todos los proyectos disponibles en el servidor de redmine
            const myarr = await RedmineLogic.projects()
            var mystr =''
            
            //corrobora que hayan proyectos disponibles
            if(myarr.length>0){

              //crea un string con todos los proyectos disponibles
              for(let i=0; i<myarr.length; i++){
                mystr=mystr+' '+myarr[i]
              };

              SlackFunctions.sendMsg(ch, 'Estos son los proyectos disponibles:'+mystr)

            }else SlackFunctions.sendMsg(ch, 'No hay proyectos disponibles en la base de datos.')
  
          }else if(message[2] == 'issue'){ //lee la tercer palabra del mensaje y compara si es relativo a proyectos
  
            var issue =message[3];
            var firstBreakPoint = true
            var proy =''

            //obtiene el issue y el proyecto del mensaje enviado
            for (let k = 4; k < message.length; k++) {

              if(!Comparator.proximity(message[k], 'proyecto') && firstBreakPoint) issue=issue+'_'+message[k]
              else {
  
                if(firstBreakPoint){
                  
                  firstBreakPoint=!firstBreakPoint
                  proy=proy+message[k+1]
                  k=k+1

                }
                else proy=proy+'_'+message[k]
  
              }
  
            }

            //obtiene todos los proyectos disponibles en el servidor de redmine
            const myprojects = await RedmineLogic.projects()

            var proyFind = false
  
            for (let i=0; i<myprojects.length && !proyFind; i++)
              if(Comparator.proximity(proy, myprojects[i])){
                proyFind = true
                proy=myprojects[i]
              }
            
            if(proyFind){

              //obtiene todos los issues disponibles en el proyecto
              const myissues = await RedmineLogic.project(proy)
  
              var issueFind = false

              //corrobora que el issue ingresado coincida con alguno de los issues obtenidos del servidor
              for (let i=0; i<myissues.length && !issueFind; i++)
                if(Comparator.proximity(issue, myissues[i])){
                  issueFind = true
                  issue=myissues[i]
                }

              if(issueFind){

                //obtiene el ultimo comentario agregado en el issue
                const mystr = await RedmineLogic.issue(proy, issue)
    
                SlackFunctions.sendMsg(ch, 'El ultimo comentario agregado fue: '+mystr)

              }else SlackFunctions.sendMsg(ch, 'El issue que ingreso no pertenece a la base de datos.')

            }else SlackFunctions.sendMsg(ch, 'El proyecto que ingreso no pertenece a la base de datos.')
  
          }
        }else if(message[1]!=null && Comparator.proximity(message[1], 'reminder')){//corrobora que la segunda palabra del mensaje coincida con reminder

          if(Comparator.proximity(message[2], 'set') && Comparator.proximity(message[3], 'issue')){ //corrobora que la tercer y cuarta palabra del mensaje coincidan con set e issue respectivamente
    
              var issue = message[4];
              var firstBreakPoint = true
              var secondBreakPoint = true
              var proy = ''
              var users = ''

              //obtiene del mensaje el issue, el proyecto y los usuarios a los que setear el reminder
              for (let k = 5; k < message.length; k++) {

                if(!Comparator.proximity(message[k], 'proyecto') && !firstBreakPoint && !secondBreakPoint) issue=issue+'_'+message[k]

                else if(firstBreakPoint && Comparator.proximity(message[k], 'proyecto')) {
                    
                  firstBreakPoint=false
                  proy=proy+message[k+1]
                  k=k+1
                  message[k]

                }else if(!Comparator.proximity(message[k], 'users')) {
                  
                  proy=proy+'_'+message[k]

                }else if(secondBreakPoint && Comparator.proximity(message[k], 'users')){

                  secondBreakPoint=false
                  users=users+message[k+1]
                  k=k+1

                }else users=users+' '+message[k]
    
              }

              //obtiene todos los proyectos disponibles en el servidor
              const myprojects = await RedmineLogic.projects()
    
              var proyFind = false
  
              for (let i=0; i<myprojects.length && !proyFind; i++)
                if(Comparator.proximity(proy, myprojects[i])){
                  proyFind = true
                  proy=myprojects[i]
                }
              
              //corrobora que haya encontrado un proyecto
              if(proyFind){

                //obtiene todos los issues disponibles del proyecto
                const myissues = await RedmineLogic.project(proy)
    
                var issueFind = false

                //corrobora que el issue ingresado coincida con alguno de los issues obtenidos del servidor
                for (let i=0; i<myissues.length && !issueFind; i++)
                  if(Comparator.proximity(issue, myissues[i])){
                    issueFind = true
                    issue=myissues[i]
                  }

                if(issueFind){

                  var data

                  data=await Requests.fileGet();

                  if(data[proy]==null) data[proy]={}
                  
                  data[proy][issue]=users

                  var jsonData = JSON.stringify(data)

                  await Requests.fileWrite(jsonData)

                  SlackFunctions.sendMsg(ch, 'Nuevo reminder set')

                }else SlackFunctions.sendMsg(ch, 'El issue que ingreso no pertenece a la base de datos.')

                

              }else SlackFunctions.sendMsg(ch, 'El proyecto que ingreso no pertenece a la base de datos.')
    
          }else if(message[2] == 'remind'){
  
            const fecha=new Date()

            var month = fecha.getMonth()+1

            if(month<10) month='0'+month

            var day = fecha.getDate()
            
            if(day<10) day='0'+day
            
            var today = fecha.getFullYear()+'-'+month+'-'+day
            
            const myarr = await RedmineLogic.duedateissues(today)
            
            var mystr = 'Estos issues vencen hoy:'
            
            const tagsArr = await Requests.fileGet()
            
            for (let proy in tagsArr)
              for(let issue in tagsArr[proy])
                if(myarr.includes(issue))
                  mystr = mystr + ' ' + issue + ' ' + tagsArr[proy][issue]

            SlackFunctions.sendMsg(ch, mystr)

          }else SlackFunctions.error(ch)
        }else if(message[1]!=null && Comparator.proximity(message[1], 'horoscopo')){

          const signo = await Puppeteer.horoscopo(message[2])

          SlackFunctions.sendMsg(ch, signo)

        }else if(message[1]!=null && Comparator.proximity(message[1], 'clima')){

          const clima = await Puppeteer.clima(message[2])

          SlackFunctions.sendMsg(ch, clima)

        }if(message[1]!=null && Comparator.proximity(message[1], 'ayuda')){

          const aiuda = "Los posibles comandos son:\nbotto buscar proyectos\n botto buscar poryecto (nombre del proyecto)\nbotto buscar issue proyecto (nombre del proyecto) issue (nombre del issue)\nbotto reminder remind\nbotto reminder set issue (nombre del issue) proyecto (nombre del proyecto) users (tags de los usuarios a mencionar)\nbotto horoscopo (signo)\nbotto clima (lugar)"

          SlackFunctions.sendMsg(ch, aiuda)

        }else SlackFunctions.error()
      }catch (e) {
        console.log(e)
        SlackFunctions.error(ch)
      }

    }else if(Comparator.proximity(event.text, 'que dia es hoy')){

      SlackFunctions.sendMsg(ch, 'https://www.youtube.com/watch?v=atzaP0pnPCY')

    }
  }
})
const auth = require('./constants')

import { WebClient } from '@slack/web-api'
import * as RedmineLogic from './redmineLogic'

const web = new WebClient(auth.SLACK_BOT_AUTH)

export async function dueDate(){

    const fecha=new Date()

    var month = fecha.getMonth()+1
    if(month<10) month='0'+month

    var day = fecha.getDate()
    if(day<10) day='0'+day

    var today = fecha.getFullYear()+'-'+month+'-'+day

    const myarr = await RedmineLogic.duedateissues(today)

    var mystr = 'Estos issues vencen hoy:'
    for(let i=0; i<myarr.length; i++){
        mystr=mystr+' '+myarr[i]
    };

  }
  
export function error(channel){
  
  sendMsg(channel,'Hmm algo salio mal...')

}
  
export async function sendMsg(channel, msg){
  try{
    await web.chat.postMessage({
      channel: channel,
      text: msg
    })
  }catch(e){
    console.log(e)
  }
}
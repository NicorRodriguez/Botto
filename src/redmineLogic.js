const request = require('./requests')
const Comparator = require('./comparator')
const constants = require('./constants')

export function projects(){
    return new Promise((resolve)=>{

        request.httpGet("GET", constants.serv+'projects.json').then(data => {

            const myarr=[]
            
            for(const i in data['projects'])myarr.push(data['projects'][i]['name'])
    
            resolve(myarr);
        });

    });
}

export function project(proy){
    return new Promise((resolve)=>{

        request.httpGet("GET", constants.serv+'projects.json').then(projectsDATA => {

            var name
            var proyId
            for(const i in projectsDATA['projects']){
                name = projectsDATA['projects'][i]['name']

                if(Comparator.proximity(name, proy)){

                    proyId=projectsDATA['projects'][i]['id']

                    request.httpGet("GET", constants.serv+'issues.json?project_id='+proyId).then(issuesData => {

                        const issues=[]

                        for(const issue in issuesData['issues']){

                            const myissue= issuesData['issues'][issue]['subject']
                            issues.push(myissue)

                        }

                        resolve(issues);

                    });

                }
            }

        });

    });
}

export function issue(proy, issue){
    return new Promise((resolve)=>{

        request.httpGet("GET", constants.serv+'projects.json').then(projectsData => {

            var name
            var proyId
            for(const i in projectsData['projects']){
                name = projectsData['projects'][i]['name']

                if(Comparator.proximity(name, proy)){

                    proyId=projectsData['projects'][i]['id']

                    request.httpGet('GET', constants.serv+'issues.json?project_id='+proyId).then(issuesData => {

                        for(const iterableissue in issuesData['issues']){

                            const myissue= issuesData['issues'][iterableissue]['subject']
                            
                            if(Comparator.proximity(myissue, issue)){

                                const myissueid = issuesData['issues'][iterableissue]['id']

                                request.httpGet('GET', 'http://192.168.1.101:8080/time_entries.json?project_id='+proyId).then(timeData => {
                                    var mytime = ''
                                    var check = true
                                    var i = 0

                                    while(check && i<timeData['time_entries'].length){

                                        if(check && timeData['time_entries'][i]['issue']['id']==myissueid){

                                            check=!check
                                            mytime=timeData['time_entries'][i]['comments']

                                        }
                                        i+=1

                                    }

                                    mytime=mytime+' http://192.168.1.101:8080/issues/'+myissueid+'?tab=time_entries'

                                    resolve(mytime);

                                })

                            }

                        }

                    });

                }
            }

        });

    });
}

export function duedateissues(date){
    return new Promise((resolve)=>{

        request.httpGet("GET", constants.serv+'issues.json').then(issuesData => {

            const issues=[]

            for(const issue in issuesData['issues']){
                if(issuesData['issues'][issue]['due_date']==date){
                    const myissue= issuesData['issues'][issue]['subject']
                    issues.push(myissue)
                }
            }

            resolve(issues);

        });

    });
}
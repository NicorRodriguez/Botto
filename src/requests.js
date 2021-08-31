export async function httpGet(action, url)
{
    return new Promise((resolve, reject)=>{
        var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
        var xmlHttp = new XMLHttpRequest();

        xmlHttp.open(action, url); // true for asynchronous 
        xmlHttp.send(null);

        xmlHttp.onload = () =>{
            const data = JSON.parse(xmlHttp.responseText);
            resolve(data);
        };
    });
}

export async function fileGet()
{
    return new Promise((resolve)=>{
        const fs = require('fs')
        fs.readFile('/home/nicolas/Documents/NetLabsAcademy/Sprint5/Scripts/myBotEvents/src/reminders.json', 'utf8', (err, jsonString) => {
            if (err) {
                console.log("File read failed:", err)
                return
            }
            const data =JSON.parse(jsonString)
            resolve(data)
        })
    });
}

export async function fileWrite(jsonData){
    return new Promise((resolve=>{
        const fs = require('fs');
          fs.writeFile("/home/nicolas/Documents/NetLabsAcademy/Sprint5/Scripts/myBotEvents/src/reminders.json", jsonData, function(err) {
              if (err) {
                  console.log(err);
              }else{resolve()}
          });
    }))
}
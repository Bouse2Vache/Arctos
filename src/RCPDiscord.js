//Modules
const RPC = require('discord-rpc') // Module du Statut pour discord



class RCPDiscord{
    constructor (){
        this.client;
    }
    ResLoadRCP(res, rows, id, name, clientID, details=undefined, state=undefined, largeImage=undefined, largeText=undefined, smallImage=undefined, smallText=undefined, instance=false, temps=false, partysize=undefined, partymax=undefined, btn0nom=undefined, btn0url=undefined, btn1nom=undefined, btn1url=undefined, loadeur="ipc") {
        const client = new RPC.Client({transport: loadeur})
        var load = {
            currentname: name,
            currentid: id
        }
        client.on('ready', () => {
            RPC.register(clientID)

            var activity = {}
            activity.buttons = []
            if(details != undefined) activity.details = details
            if(state != undefined) activity.state = state
            if(largeImage != undefined) activity.largeImageKey = largeImage
            if(largeText != undefined) activity.largeImageText = largeText
            if(smallImage != undefined) activity.smallImageKey = smallImage
            if(smallText != undefined) activity.smallImageText = smallText
            if(partysize != undefined && partymax != undefined){
                if(parseInt(partysize) == NaN || parseInt(partymax) == NaN) {
                    res.render(__dirname + '/public/params.ejs', {liste: rows, load: parms, erreur: true})
                    return
                }
            
                
                activity.partySize = Number(partysize)
                activity.partyMax = Number(partymax)
            }   
            if(temps != undefined){
                activity.startTimestamp = Date.now()
            }
            activity.instance = instance
            if(btn0nom != undefined && btn0url != undefined){
                var btn = {
                    label: btn0nom,
                    url: btn0url
                }
                activity.buttons.push(btn)
            }
            if(btn1nom != undefined && btn1url != undefined){
                var btn = {
                    label: btn1nom,
                    url: btn1url
                }
                activity.buttons.push(btn)
            }

            client.setActivity(activity, process.pid)
            
            res.render(__dirname + '/public/params.ejs', {liste: rows, erreur: false, load: load})

        })
        

        client.login({ clientId: clientID}).catch((e) => {
            console.log(e)
            res.render(__dirname + '/public/params.ejs', {liste: rows, erreur: true, load: load})
        });
        this.client = client
        
    }

    stop(){
        if(this.client == undefined) return
        this.client.destroy()
    }

}


module.exports = { RCPDiscord }

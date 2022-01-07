// LES MODULES
const {app, BrowserWindow} = require('electron') // Module de la fenêtre
const path = require('path') // Module pour les chemains entre fichiers
const express = require('express'); // Module de forms
const bodyParser = require('body-parser')
const methodOverride = require('method-override');
const sqlite3 = require('sqlite3')
const uuid = require('uuid')
const fs = require('fs')
require('events').EventEmitter.prototype._maxListeners = 100;
const opn = require('opn')

//imports 
const { RCPDiscord } = require('./src/RPCDiscord.js')
var RCP = new RCPDiscord()


const db = new sqlite3.Database('./database.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE)
const Eapp = express();

//DB init
db.run('CREATE TABLE IF NOT EXISTS profiles(id TEXT, userid TEXT, nom TEXT, details TEXT, state TEXT, largeimage TEXT, largetext TEXT, smallimage TEXT, smalltext TEXT, instance INT, temps INT, partysize TEXT, partymax TEXT, btn0nom TEXT, btn0url TEXT, btn1nom TEXT, btn1url)')


//Initialisation -> Load profile if is loadt

//Init Express
Eapp.set('view engine', 'ejs');
Eapp.use(bodyParser.urlencoded({extended: false}))
Eapp.use(express.urlencoded({extended: false}));
Eapp.use(methodOverride('_method'));
Eapp.set('views',__dirname)
Eapp.use('/public', express.static(__dirname + "/src/public"));

//functions
function SaveInDB(body, id) {
    var name = body.nom
    var userid = body.userid
    var details = undefined
    var state = undefined
    var largeimage = undefined
    var largetext = undefined
    var smallimage = undefined
    var smalltext = undefined
    var instance = 0
    var temps = 0
    var partysize = undefined
    var partymax = undefined
    var btn0nom = undefined
    var btn0url = undefined
    var btn1nom = undefined
    var btn1url = undefined
    if(!(body.details == '')) details = body.details
    if(!(body.state == '')) state = body.state
    if(!(body.largeimage == '')) largeimage = body.largeimage
    if(!(body.largetext == '')) largetext = body.largetext
    if(!(body.smallimage == '')) smallimage = body.smallimage
    if(!(body.smalltext == '')) smalltext = body.smalltext
    if((body.instance == 'on')) instance = 1
    if((body.temps == 'on')) temps = 1
    if(!(body.partysize == '')) partysize = body.partysize
    if(!(body.btn0nom == '')) btn0nom = body.btn0nom
    if(!(body.partymax == '')) partymax = body.partymax
    if(!(body.btn0url == '')) btn0url = body.btn0url
    if(!(body.btn1nom == '')) btn1nom = body.btn1nom
    if(!(body.btn1url == '')) btn1url = body.btn1url
    

    db.run('INSERT INTO profiles(id, userid, nom, details, state, largeimage, largetext, smallimage, smalltext, instance, temps, partysize, partymax, btn0nom, btn0url, btn1nom, btn1url) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?,?,?,?)', [id, userid, name, details, state, largeimage, largetext, smallimage, smalltext, instance, temps, partysize, partymax, btn0nom, btn0url, btn1nom, btn1url])
}


Eapp.get('/', (req, res) => {
    db.all('SELECT * FROM profiles', function(err, rows){
        res.render(__dirname + '/src/public/index.ejs', {liste: rows})
    })

})

Eapp.get('/youtube', (req, res) => {
    opn('https://www.youtube.com/channel/UCIWePiyoHE_6KT-tnDdgvLw')
    db.all('SELECT * FROM profiles', function(err, rows){
        res.render(__dirname + '/src/public/index.ejs', {liste: rows})
    })
})

Eapp.get('/github', (req, res) => {
    opn('https://github.com/ZaryusDev')
    db.all('SELECT * FROM profiles', function(err, rows){
        res.render(__dirname + '/src/public/index.ejs', {liste: rows})
    })
})

Eapp.get('/discord', (req, res) => {
    opn('https://discord.gg/bvQTMmQUQp')
    db.all('SELECT * FROM profiles', function(err, rows){
        res.render(__dirname + '/src/public/index.ejs', {liste: rows})
    })
})

Eapp.get('/new', (req, res) => {
    db.all('SELECT * FROM profiles', function(err, rows){
        var newarticle = {
            bouton: [
                {
                    label: "",
                    url:""
                },
                {
                    label: "",
                    url:""
                }
            ]
        }
        res.render(__dirname + '/src/public/new.ejs', {article: newarticle, liste: rows})
    })

    
})

Eapp.post('/new', async (req, res, next) => {
    var id = uuid.v1()
    SaveInDB(req.body, id)
    db.all('SELECT * FROM profiles', function(err, rows){
        res.render(__dirname + '/src/public/index.ejs', {liste: rows})
    })
})

Eapp.get('/edit/:id', async (req, res) => {
    db.all('SELECT * FROM profiles', function(err, liste){
        db.all('SELECT * FROM profiles WHERE id = ?', [req.params.id], function(err, rows){
            const article = rows[0]
            
            if (article == undefined){
                return
            }
            var instance = false
            if(article.instance == 1) instance = true
            var temps = false
            if(article.temps == 1) temps = true
            var art = {
                nom: article.nom,
                userid: article.userid,
                id: article.id,
                details: article.details,
                state: article.state,
                largeimage: article.largeimage,
                largetext: article.largetext,
                smallimage: article.smallimage,
                smalltext: article.smalltext, 
                instance: instance,
                temps: temps,
                bouton: [
                    {
                        label: article.btn0nom,
                        url: article.btn0url,
                    }, {
                        label: article.btn1nom,
                        url: article.btn1url
                    }
                ],
                partysize: article.partysize,
                partymax: article.partymax,
                
            }
            
            
            res.render(__dirname + '/src/public/edit.ejs', { article: art, liste: liste })
            
        })
    })
})

Eapp.put('/:id', async (req, res, next) => {
    var body = req.body
    var name = body.nom
    var userid = body.userid
    var details = undefined
    var state = undefined
    var largeimage = undefined
    var largetext = undefined
    var smallimage = undefined
    var smalltext = undefined
    var instance = 0
    var temps = 0
    var partysize = undefined
    var partymax = undefined
    var btn0nom = undefined
    var btn0url = undefined
    var btn1nom = undefined
    var btn1url = undefined
    if(!(body.details == '')) details = body.details
    if(!(body.state == '')) state = body.state
    if(!(body.largeimage == '')) largeimage = body.largeimage
    if(!(body.largetext == '')) largetext = body.largetext
    if(!(body.smallimage == '')) smallimage = body.smallimage
    if(!(body.smalltext == '')) smalltext = body.smalltext
    if((body.instance == 'on')) instance = 1
    if((body.temps == 'on')) temps = 1
    if(!(body.partysize == '')) partysize = body.partysize
    if(!(body.btn0nom == '')) btn0nom = body.btn0nom
    if(!(body.partymax == '')) partymax = body.partymax
    if(!(body.btn0url == '')) btn0url = body.btn0url
    if(!(body.btn1nom == '')) btn1nom = body.btn1nom
    if(!(body.btn1url == '')) btn1url = body.btn1url
    let data = [userid, name, details, state, largeimage, largetext, smallimage, smalltext, instance, temps, partysize, partymax, btn0nom, btn0url, btn1nom, btn1url, req.params.id]
    //userid, nom, details, state, largeimage, largetext, smallimage, smalltext
    let sql = `UPDATE profiles
                SET userid = ?,
                    nom = ?,
                    details = ?,
                    state = ?,
                    largeimage = ?,
                    largetext = ?,
                    smallimage = ?,
                    smalltext = ?,
                    instance = ?,
                    temps = ?,
                    partysize = ?,
                    partymax = ?,
                    btn0nom = ?,
                    btn0url = ?,
                    btn1nom = ?,
                    btn1url = ?
                WHERE id = ?`
    db.run(sql, data, function(err) {
        if(err) {
            return console.error(err.message)
        }
    })
    db.all('SELECT * FROM profiles', function(err, rows){
        res.redirect('/')
    })
})

Eapp.delete('/:id', async (req, res) => {
    let data = [req.params.id]
    let sql = `DELETE FROM profiles WHERE id = ?`
    db.run(sql, data, function(err) {
        if(err) {
            return console.error(err.message)
        }
    })
    db.all('SELECT * FROM profiles', function(err, rows){
        res.redirect('/')
    })
})

Eapp.get('/parametres', (req, res) => {
    db.all('SELECT * FROM profiles', function(err, rows){

        res.render(__dirname + '/src/public/params.ejs', {liste: rows, erreur: undefined})
    })
})

Eapp.get('/stop', (req, res) => {
    db.all('SELECT * FROM profiles', function(err, rows){
        RCP.stop()
        res.render(__dirname + '/src/public/params.ejs', {liste: rows, erreur: undefined})
    })
})


Eapp.post('/parametres', (req, res) => {
    
    db.all('SELECT * FROM profiles', function(err, liste){
        db.all('SELECT * FROM profiles WHERE id = ?', [req.body.profiles], function(err, rows){
            const article = rows[0]
            
            if (article == undefined){
                return
            }
            var instance = false
            if(article.instance == 1) instance = true
            var temps = false
            if(article.temps == 1) temps = true
            RCP.ResLoadRCP(res, rows, article.id, article.nom, article.userid, article.details, article.state, article.largeimage, article.largetext, article.smallimage, article.smalltext, instance, temps, article.partysize, article.partymax, article.btn0nom, article.btn0url, article.btn1nom, article.btn1url, req.body.loadeur)
            
    
            
        })
    })
})



Eapp.listen(5000)

Eapp.post('/')

if (require('electron-squirrel-startup')) {
    app.quit();
}
app.disableHardwareAcceleration()

const createWindow = () => {
    const mainWindow = new BrowserWindow({
        width: 900,
        height: 600,
        minHeight: 600,
        minWidth: 900,
        webPreferences: {
            nodeIntegration: true,

        }
    });
    mainWindow.setMenu(null)
    mainWindow.title = "Arctos"
    mainWindow.loadURL('http://localhost:5000/')
    mainWindow.setIcon('./uninstallerIcon.ico')

};
  
app.on('ready', createWindow);
  
  // Quit when all windows are closed.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });
  
app.on('activate', () => {

    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
});

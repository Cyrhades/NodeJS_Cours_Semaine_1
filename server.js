const express = require('express')
const app = express()
const path = require('path')
const config = require('./app/config')
const bodyParser = require('body-parser')
const chalk = require('chalk')
const session = require('express-session')

//------------------------------------------------------------------------------
//      Connexion à mongoDB
//------------------------------------------------------------------------------
var mongoose = require('mongoose');
mongoose.connect(
    config.database, 
    {useNewUrlParser: true, useUnifiedTopology: true }
);
mongoose.connection.once('open', function() {
    console.log(chalk.red(`Nous sommes connecté à MongoDB`));
});


//------------------------------------------------------------------------------
//          PASSPORT
//------------------------------------------------------------------------------
require('./app/passport')(app)

//------------------------------------------------------------------------------
//      Ajout des sessions à notre application 
//------------------------------------------------------------------------------
app.use(session({
    secret: config.appKey, resave:false,saveUninitialized:false, 
    cookie: {maxAge: 3600000} 
}))
// permet de renvoyer les sessions à la vue
app.use((req,res,next) => {res.locals.session = req.session; next();});

//------------------------------------------------------------------------------
//     FlashBag 
//------------------------------------------------------------------------------
app.use(require('express-flash')());

//------------------------------------------------------------------------------
//      Ajout du middleware BodyParser
//------------------------------------------------------------------------------
app.use(bodyParser.urlencoded({extended: false}))

//------------------------------------------------------------------------------
//      Mise en place du moteur de template
//------------------------------------------------------------------------------
app.set('views', path.join(__dirname, 'src/templates'))
app.set('view engine', 'pug')

//------------------------------------------------------------------------------
//      Mise en place du répertoire static
//------------------------------------------------------------------------------
app.use(express.static(path.join(__dirname, 'public')))

//------------------------------------------------------------------------------
//      Chargement des routes
//------------------------------------------------------------------------------
require('./app/routes')(app)

//------------------------------------------------------------------------------
//     Ecoute du serveur HTTP
//------------------------------------------------------------------------------
app.listen(config.port,() => {
    if (process.send) {
        process.send('online');
    }
    console.log(`Le serveur est démarré : ${chalk.black.bgYellow(`http://localhost:${config.port}`)}` )
})
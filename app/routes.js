const passport = require('passport')
module.exports = (app) => {

    app.get('/', (req, res) => {
        var Controller = require('../src/controllers/Home.js')
        var Home = new Controller();
        Home.printHome(req, res);
    })
    
    
    app.get('/inscription', (req, res) => {
        var Controller = require('../src/controllers/Register.js')
        var Register = new Controller();
        Register.printForm(req, res);
    })

    app.post('/inscription', (req, res) => {
        var Controller = require('../src/controllers/Register.js')
        var Register = new Controller();
        Register.process(req, res);
    })


    app.get('/connexion', (req, res) => {
        var Controller = require('../src/controllers/Connection.js')
        var Connection = new Controller();
        Connection.printForm(req, res);
    })

    app.post('/connexion', (req, res) => {
        // systeme de connexion avec Passport
        passport.authenticate(
            'local',
            { successRedirect: '/', failureRedirect: '/connexion' }          
        )(req, res)
        /* systeme de connexion classique
        var Controller = require('../src/controllers/Connection.js')
        var Connection = new Controller();
        Connection.process(req, res);
        */
    })

    // la connexion google avec Passport
    app.get('/connexion/google', 
        passport.authenticate('google', { scope: ['profile'] })
    )
    // la page de callback
    app.get('/connexion/google/callback', passport.authenticate('google', { successRedirect: '/', failureRedirect: '/connexion' }));



    // la connexion google avec Passport
    app.get('/connexion/github', 
        passport.authenticate('github', { scope: ['profile'] })
    )
    // la page de callback
    app.get('/connexion/github/callback', 
        passport.authenticate('github', { 
            successRedirect: '/', 
            failureRedirect: '/connexion' 
        })
    );


    app.get('/deconnexion', (req, res) => {
        req.session.user = null;
        res.redirect('/');
    })
}
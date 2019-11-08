const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github').Strategy;

const config = require('./app/config')

module.exports = (app) => {
  
    app.use(passport.initialize())
    app.use(passport.session())


    passport.use(new GitHubStrategy({
        clientID: config.github.clientID,
        clientSecret: config.github.clientSecret,
        callbackURL: "/connexion/github/callback",
        passReqToCallback: true
      },
      (request, accessToken, refreshToken, profile, done) => {
        let UserModel = require('../src/models/User.js')
        let User = new UserModel()
        
        User.connectWithProvider('github', profile.id, profile.name, '').then((user) => {
            request.session.user = {
                connected : true,
                firstname : user.firstname,
                lastname : user.lastname
            }
            request.flash('success', `Vous êtes maintenant connecté !`);
            return done(null, user);
        }).catch((error) => {
            request.session.user = null;
            request.flash('error',  `L'authentification a échouée !`)
            return done(null, false, { message: `L'authentification a échouée` });
        })
    }))


    passport.use(new GoogleStrategy({
            clientID: config.google.clientID,
            clientSecret: config.google.clientSecret,
            callbackURL: "/connexion/google/callback",
            passReqToCallback: true
        },
        (request, accessToken, refreshToken, profile, done) => {
            let UserModel = require('../src/models/User.js')
            let User = new UserModel()

            User.connectWithProvider('google', profile.id, profile.name.givenName, profile.name.familyName).then((user) => { 
                request.session.user = {
                    connected : true,
                    firstname : user.firstname,
                    lastname : user.lastname
                }
                request.flash('success', `Vous êtes maintenant connecté !`);
                return done(null, user);
            }).catch((error) => {
                request.session.user = null;
                request.flash('error',  `L'authentification a échouée !`)
                return done(null, false, { message: `L'authentification a échouée` });
            })
        }
    ));


    passport.use(new LocalStrategy({
            usernameField: 'email',
            passReqToCallback: true
        },
        (request, email, password, done) => {
            let UserModel = require('../src/models/User.js')
            let User = new UserModel()

            User.connect( email, password ).then((user) => {
                // on enregistre en session le fait que l'utilisateur est connecté
                // exemple d'utilisation de request
                request.session.user = {
                    connected : true,
                    firstname : user.firstname,
                    lastname : user.lastname
                }
                request.flash('success', `Vous êtes maintenant connecté !`);
                return done(null, user);

            }, (error) => {
                // en cas d'erreur on écrase les informations de session
                request.session.user = null;
                request.flash('error',  `L'authentification a échouée !`)
                request.flash('email',  email)  
                return done(null, false);
            })
        }
    ));

    passport.serializeUser((user, cb) => {
        cb(null, user.id)
    });

    passport.deserializeUser((id, cb) => {
        const UserMongo = require('../src/models/UserMongoDB.js')
        UserMongo.findById(id, function (err, user) {
            cb(err, user)
        });
    });
}

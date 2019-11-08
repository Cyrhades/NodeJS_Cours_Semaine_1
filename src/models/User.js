const config = require('../../app/config')
var UserMongo = require('./UserMongoDB.js')
const bcrypt = require('bcrypt');


module.exports = class User {

    add(firstname, lastname, email, password) {
        /*
        password = this.hashPassword(password)
        UserMongo.create({firstname, lastname, email, password})
        */
        // ou (faire npm install bcrypt)

        bcrypt.genSalt(config.saltRounds, (err, salt) => {
            bcrypt.hash(password, salt, (err, password) => {
                UserMongo.create({firstname, lastname, email, password})
            });
        });
        
    }

    connect(email, password) {
        return new Promise((resolve, reject) => {

            UserMongo.findOne({ email }, (err, User) => {
                if (!err && User !== null) {
                    /* si vous avez utilisé crypto
                    password = this.hashPassword(password)
                    if(User.password == password){
                        resolve(User);
                    } 
                    */
                    // ou                   
                    bcrypt.compare(password, User.password, (err, res) => {
 
                        if(!err && res === true) {
                            resolve(User);
                        } else {
                            reject('Identification échouée');
                        }
                    });
                } else {
                    reject('Identification échouée');
                }                
            })
        })
    }

    connectWithProvider(provider, email, firstname, lastname) {
        return new Promise((resolve, rejected) => {
            UserMongo.findOne({ email, provider }).exec((err, user) => {
                // Si il y a une erreur (pas de résultat) c'est que l'identification a échoué
                if (err || user == null) {
                    // on crée donc un nouvel utilisateur
                    new UserMongo({ firstname, lastname, email, password : '', provider }).save((error, user) => {
                        resolve(user)
                    })
                } else {
                    // sinon on renvoi les informations de l'utilisateur
                    resolve(user);
                }
            })
        })
    }

    // Dans ce cours nous avons vu le hashage avec crypto (un hashage basique SHA1) 
    // et un hashage complexe avec grain de sel avec bcrypt
    hashPassword(password)
    {
        return require('crypto').createHash('sha1').update(config.appKey + password).digest('hex')
    }


}

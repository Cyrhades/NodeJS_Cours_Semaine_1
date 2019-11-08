var AbstractController = require('./AbstractController.js')

module.exports = class Connection extends AbstractController {

    printForm(request, response) {
        // On ne doit pas être connecté pour aller sur cette page
        if(this.isConnected(request, response)) return;
        response.render('connexion')   
    }

    process(request, response) {
        // On ne doit pas être connecté pour aller sur cette page
        if(this.isConnected(request, response)) return;

        var UserModel = require('../models/User.js')
        var User = new UserModel()
        var UserConnected = User.connect(
            request.body.email,
            request.body.password
        );

        UserConnected.then( (User) => {
            request.session.user = {
                connected : true,
                firstname : User.firstname,
                lastname : User.lastname
            }
            request.flash('success', `Vous êtes maintenant connecté !`);
            response.redirect('/')
        },
        () => {
            request.flash('error',  `L'authentification a échouée !`)
            request.flash('email',  request.body.email)    
            response.redirect('/connexion')
        })
    }
    
}
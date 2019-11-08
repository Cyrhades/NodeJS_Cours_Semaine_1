var AbstractController = require('./AbstractController.js')

module.exports = class Register extends AbstractController {

    printForm(request, response) {
        // On ne doit pas être connecté pour aller sur cette page
        if(this.isConnected(request, response)) return;

        response.render('form_register')        
    }

    process(request, response) {
        // On ne doit pas être connecté pour aller sur cette page
        if(this.isConnected(request, response)) return;

        var UserModel = require('../models/User.js')
        var User = new UserModel()
        User.add(
            request.body.firstname, 
            request.body.lastname, 
            request.body.email, 
            request.body.password
        )
        request.flash('success', `Vous êtes maintenant inscris, connectez vous pour profiter de tout nos services !`);
        response.redirect('/connexion')
    }
}
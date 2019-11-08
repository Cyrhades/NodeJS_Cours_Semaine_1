var AbstractController = require('./AbstractController.js')

module.exports = class Home extends AbstractController {
    printHome(request, response) {
        response.render('home')
    }    
}
module.exports = class AbstractController {

    constructor() {
        if (this.constructor === AbstractController) {
            throw new TypeError('Abstract class "AbstractController" cannot be instantiated directly');
        }
    }

    isConnected(request, response) {
        if(request.session.user && request.session.user.connected === true) {
            response.redirect('/')
            return true;
        }
        return false;
    }
}
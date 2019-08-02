'use strict'

const UserController = require('../controllers/user');

class Routes{
    constructor(app){
        this.app = app;
    }

    appRoutes(){
		
        this.app.post('/register', UserController.registerUser);
        this.app.post('/login', UserController.loginUser);	
        this.app.post('/userSessionCheck', UserController.userSessionCkeck);	

		//this.app.get('*', routeHandler.routeNotFoundHandler);		
    }
    

    routesConfig(){
        this.appRoutes();
    }
}

module.exports = Routes;
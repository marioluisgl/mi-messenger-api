'use strict'

const mongoose = require('mongoose');
const express = require("express");
const http = require('http');
const socketio = require('socket.io');

const routes = require('./web/routes'); 
const socketEvents = require('./web/socket'); 

const appConfig = require('./app'); 

class Server {
    constructor(){
        this.db = mongoose;
        this.app = express();
        this.http = http.Server(this.app);
        this.socket = socketio(this.http);
    }

    appConfig(){        
        new appConfig(this.app).includeConfig();
    }

    includeRoutes(){
        new routes(this.app).routesConfig();
        new socketEvents(this.socket).socketConfig();
    }

    appExecute(){

        this.appConfig();
        this.includeRoutes();

        const port =  process.env.PORT || 3800;  
        
        this.db.set('useNewUrlParser', true);
        this.db.set('useFindAndModify', false);
        this.db.set('useCreateIndex', true);
        this.db.connect('mongodb://localhost:27017/mi-messenger-database')
                .then(()=>{
                    console.log('DataBase connected succesfuly');

                    //connect to the server
                    this.http.listen(port, ()=>{
                        console.log(`Server listening on http://localhost:${port}`);
                    });
                })
                .catch((err)=>{
                    console.log(err);
                });
    }
}


const app = new Server();
app.appExecute();
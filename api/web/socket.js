'use strict'
const queryHandler = require('./../handlers/query-handler');

class Socket{

	constructor(socket){
		this.io = socket;
    }

    socketEvents(){

        this.io.on('connection', (socket)=>{
            console.log('cliente conectado al socket', socket.id); 
        });
    }


    socketConfig(){
        this.io.use(async(socket, next)=>{
            try{
                await queryHandler.addSocketId({
                    userId: socket.request._query['userId'],
					socketId: socket.id
                });
                next();

            } catch(error){
                console.log(error);
            }
        });
        this.socketEvents();
    }
}  

module.exports = Socket;
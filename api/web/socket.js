'use strict'

const queryHandler = require('./../handlers/query-handler');
const CONSTANTS = require('../configs/constants');
 
class Socket{


   
	constructor(socket){
		this.io = socket;
    }

    socketEvents(){

        this.io.on('connection', (socket)=>{
            console.log('cliente conectado al socket', socket.id); 

            socket.on(`chat-list`, async (data) => {
                if (data.userId == '') {
                    this.io.emit(`chat-list-response`, {
                        error : true,
                        message : CONSTANTS.USER_NOT_FOUND
                    });
                }else{
                    try {
                        const [UserInfoResponse, chatlistResponse] = await Promise.all([
                                queryHandler.getUserInfo( {
                                    userId: data.userId,
                                    socketId: false
                                }),
                                queryHandler.getChatList( socket.id )
                            ]);
                        this.io.to(socket.id).emit(`chat-list-response`, {
                            error : false,
                            singleUser : false,
                            chatList : chatlistResponse
                        });
                        socket.broadcast.emit(`chat-list-response`,{
                            error : false,
                            singleUser : true,
                            chatList : UserInfoResponse
                        });
                    } catch ( error ) {
                        console.log(error);
                        this.io.to(socket.id).emit(`chat-list-response`,{
                            error : false,
                            message : CONSTANTS.SERVER_ERROR_MESSAGE,
                            chatList : error
                        });
                    }
                }
            });


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
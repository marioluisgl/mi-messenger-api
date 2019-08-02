'use strict'

const passwordHash = require('../utils/password-hash');
const CONSTANTS =  require('../configs/constants');
const queryHandler = require('../handlers/query-handler');

class userController{

    async registerUser(req, res){
        
        const data = {
            name : (req.body.name).toLowerCase(), 
            password : req.body.password
        };

        if (data.name === '' || data.name === undefined) {
            res.status(CONSTANTS.SERVER_ERROR_HTTP_CODE).json({
                error:  true,
                message: CONSTANTS.USERNAME_NOT_FOUND
            });
            
        }else if(data.password ==='' || data.password === undefined){
            res.status(CONSTANTS.SERVER_ERROR_HTTP_CODE).json({
				error : true,
				message : CONSTANTS.PASSWORD_NOT_FOUND
			});
        }else{
             try{
                
                data.socketID = '';
                data.online = true;
                data.password = passwordHash.createHash(data.password);

                const result = await queryHandler.registerUserHandler(data);
                
                if (result === null || result === undefined) {
					res.status(CONSTANTS.SERVER_OK_HTTP_CODE).json({
						error : false,
						message : CONSTANTS.USER_REGISTRATION_FAILED
					});	           			
				}else{
                    res.status(CONSTANTS.SERVER_OK_HTTP_CODE).json({
						error : false,
						userId : result._id,
						message : CONSTANTS.USER_REGISTRATION_OK
					});
                }

            }catch(error){
                res.status(CONSTANTS.SERVER_NOT_FOUND_HTTP_CODE).json({
                    error : true,
					message : CONSTANTS.SERVER_ERROR_MESSAGE
                });
            }
        }
    }
    
    
    async loginUser(req, res){
        const data = {
            name : (req.body.name).toLowerCase(),
            password : req.body.password
        };

        if(data.name === '' || data.name === null) {
			res.status(CONSTANTS.SERVER_ERROR_HTTP_CODE).json({
				error : true,
				message : CONSTANTS.USERNAME_NOT_FOUND
			});
		}else if(data.password === '' || data.password === null) {
			res.status(CONSTANTS.SERVER_ERROR_HTTP_CODE).json({
				error : true,
				message : CONSTANTS.PASSWORD_NOT_FOUND
			});
		}else{

            try{

                const result = await queryHandler.getUserByName(data.name);
               
                if(result ===  null || result === undefined) {
					res.status(CONSTANTS.SERVER_NOT_FOUND_HTTP_CODE).json({
						error : true,
						message : CONSTANTS.USER_LOGIN_FAILED
					});
				} else{
                    if( passwordHash.compareHash(data.password, result[0].password) ){
                        await queryHandler.makeUserOnline(result[0]._id);
                        res.status(CONSTANTS.SERVER_OK_HTTP_CODE).json({
							error : false,
							userId : result[0]._id,
							message : CONSTANTS.USER_LOGIN_OK
						});

                    }else{
                        res.status(CONSTANTS.SERVER_NOT_FOUND_HTTP_CODE).json({
							error : true,
							message : CONSTANTS.USER_LOGIN_FAILED
						});
                    }
                }

            }catch(error){
                res.status(CONSTANTS.SERVER_NOT_FOUND_HTTP_CODE).json({
					error : true,
					message : CONSTANTS.USER_LOGIN_FAILED
				});
            }
        }
    }


    async userSessionCkeck(req, res){
        let userId = req.body.userId;
        if(userId === ''){
            res.status(CONSTANTS.SERVER_ERROR_HTTP_CODE).json({
				error : true,
				message : CONSTANTS.USERID_NOT_FOUND
			});
        }else {
            try {
				const result = await queryHandler.userSessionCheckHandler({ userId : userId });
				res.status(CONSTANTS.SERVER_OK_HTTP_CODE).json({
					error : false,
					name : result.name,
					message : CONSTANTS.USER_LOGIN_OK
				});
			} catch(error) {
				res.status(CONSTANTS.SERVER_NOT_ALLOWED_HTTP_CODE).json({
					error : true,
					message : CONSTANTS.USER_NOT_LOGGED_IN
				});
			}
        }
    }



}


module.exports = new userController();
'use strict'

const User = require('../models/user')

class QueryHandler{
    constructor(){
        this.user = new User();
    }

	// Metodo para registrar un usuario
    registerUserHandler(data){
        
		return new Promise( async (resolve, reject) => {
			try {
			
				User.create(data, (err, result) =>{
					
					if( err ){
						reject(err);
					}
					resolve(result);
				});
			} catch (error) {
				reject(error);
			}	
		});
	}

	//Metodo para obtener un usuario por el nombre
	getUserByName(name){
		return new Promise (async (resolve, reject) =>{

			try{

				User.find({name: name}, (error, result)=>{
					if(error){
						reject(error);
					}else{
						resolve(result);
					}
				});

			}catch (error){
				reject(error);
			}
		});
	}

	//Metodo para poner a un usuario online
	makeUserOnline(userId){
	
			try{

				User.findOneAndUpdate({_id: userId}, { "$set": {'online': true} }, {new: true, upsert: true}, (err, result)=>{
					if(err){
						return err;
					}else{
						return result;
					}
				});

			}catch(error){
				return error;
			}
	
	}

	// Metodo para assignar el id del socket cuando un usuario se conecte al servidor
	addSocketId({userId, socketId}){
		const data = {
			id : userId,
			value : {
				$set :{
					socketID : socketId,
					online : true
				}
			}
		};

		return new Promise( async(resolve, reject) =>{
			try{
				User.updateOne({_id: data.id}, data.value, (err, result)=>{
					if( err ){
						reject(err);
					}
					resolve(result);
				});

			} catch(error){
				reject(error);
			}
		});

	}

	// Metodo para chequear la seccion del usuario logueado
	userSessionCheckHandler(data){
		return new Promise( async(resolve, reject) =>{
			try{
				User.findOne({_id: data.userId, online: true}, (err, result) =>{
					if(err) {
						reject(err);
					}
					resolve(result);

				});
			}catch(error) {
				reject(error);
			}
		});
	}

	getUserInfo({userId,socketId = false}){
		let queryProjection = null;
		if(socketId){
			queryProjection = {
				"socketId" : true
			}
		} else {
			queryProjection = {
				"name" : true,
				"online" : true,
				'_id': false,
				'id': '$_id'
			}
		}
		return new Promise( async (resolve, reject) => {
			try {
			User.aggregate([
				{
					$match:  {
						_id : userId
					}
				},
				{
					$project : queryProjection
				}
				], function(err, result) {
					if( err ){
						reject(err);
					}
					socketId ? resolve(result[0]['socketId']) : resolve(result);
				});	
				
			} catch (error) {
				reject(error)
			}
		});
	}
    getChatList(userId){
		return new Promise( async (resolve, reject) => {
			try {
			User.aggregate([
				{
					$match: {
						'socketId': { $ne : userId}
					}
				},
				{
					$project:{
						"name" : true,
						"online" : true,
						'_id': false,
						'id': '$_id'
					}
				}
				],  function(err, result) {
						if( err ){
							reject(err);
						}
						resolve(result);
				});
				
			} catch (error) {
				reject(error)
			}
		});
	}




}

module.exports = new QueryHandler();
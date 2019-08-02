'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = Schema({
	socketID: String,
	online: Boolean,
	name: String, 
	password: String
});


module.exports = mongoose.model('User', UserSchema);
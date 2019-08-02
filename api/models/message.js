'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MessageSchema = Schema({
    
    emitter: { type: Schema.ObjectId, ref: 'User' },
	text: String,
	receiver: { type: Schema.ObjectId, ref: 'User' }
    
});


module.exports = mongoose.model('Message', MessageSchema);
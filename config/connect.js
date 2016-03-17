var mongo = require('mongodb');
var mongoose = require('mongoose');

//url to connect to mongolab instance
var mongodbUri = 'mongodb://healthweb:shiv123@host:port/db';
 
mongoose.connect(mongodbUri);

module.exports = mongoose;
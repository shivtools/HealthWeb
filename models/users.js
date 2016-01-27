var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//creating a schema for each user
var usersSchema = new Schema({
	name: "String",
});

mongoose.model('users', usersSchema);
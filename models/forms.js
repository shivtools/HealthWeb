var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//creating a schema for each item to be listed
var formsSchema = new Schema({
	name: "String",
	email: "String",
	number: "String",
	location: "String",
	imageURL: "String",
});

//create a model that uses the schema

var Forms = mongoose.model('Forms', formsSchema);

//make model available to all users in node app

module.exports = Forms;
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//creating a schema for each item to be listed
var legalSchema = new Schema({
	name: "String",
	email: "String",
	number: "String",
	location: "String",
	imageURL: "String",
});

//create a model that uses the schema

var Legal = mongoose.model('Legal', legalSchema);

//make model available to all users in node app

module.exports = Legal;
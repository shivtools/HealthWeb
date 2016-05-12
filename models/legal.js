var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//creating a schema for each item to be listed
var legalSchema = new Schema({
	name: "String",
	number: "String",
	location: "String",
	imageURL: "String",
	services: "String",
	requirements: "String",
	hours: "String",
	website: "String",
	user: "String",
	date: { type: Date, default: Date.now }
});

//create a model that uses the schema

var Legal = mongoose.model('Legal', legalSchema);

//make model available to all users in node app

module.exports = Legal;
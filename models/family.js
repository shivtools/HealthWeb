var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//creating a schema for each item to be listed
var familySchema = new Schema({
	name: "String",
	number: "String",
	location: "String",
	imageURL: "String",
	services: "String",
	requirements: "String",
	hours: "String",
	website: "String"
});

//create a model that uses the schema

var Family = mongoose.model('Family', familySchema);

//make model available to all users in node app

module.exports = Family;
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//creating a schema for each item to be listed
var employmentSchema = new Schema({
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

var Employment = mongoose.model('Employment', employmentSchema);

//make model available to all users in node app

module.exports = Employment;

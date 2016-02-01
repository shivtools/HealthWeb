var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//creating a schema for each item to be listed
var foodSchema = new Schema({
	name: "String",
	email: "String",
	number: "String",
	location: "String",
	website: "String",
	date: { type: Date, default: Date.now }
	// image: "Binary" //to store images for each entry.
});

//create a model that uses the schema

var Food = mongoose.model('Food', foodSchema);

//make model available to all users in node app

module.exports = Food;
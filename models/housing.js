var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//creating a schema for each item to be listed
var housingSchema = new Schema({
	name: "String",
	email: "String",
	number: "String",
	location: "String",
	website: "String",
	created_at: Date,
	updated_at: Date,
});

//create a model that uses the schema

var Housing = mongoose.model('Housing', housingSchema);

//make model available to all users in node app

module.exports = Housing;
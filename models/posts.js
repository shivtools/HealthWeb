var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//creating a schema for each user
var postsSchema = new Schema({
	content: "String",
	user: Schema.ObjectId
});

mongoose.model('posts', postsSchema);
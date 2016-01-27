var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'HealthWeb' });
});

/* GET Userlist page. */
router.get('/itemlist', function(req, res) {
    var db = req.db; //extract db object
    var collection = db.get('usercollection');
    collection.find({},{},function(e,docs){
    	//fill docs variable with db data
        res.render('itemlist', {
            "itemlist" : docs
        });
    });
});

/* GET NEW user page */
router.get('/newitem', function(req,res){
	res.render('newitem', {title: 'Add a new listing'});
});

// Add item to db with a post request

router.post('/additem', function(req, res){

	//set up db variable
	var db = req.db;

	//get form values
	var itemName = req.body.itemname;
	var itemEmail = req.body.itememail;
	//console.log(req.body); // works fine

	var collection = db.get('usercollection');

	collection.insert({
		"username": itemName,
		"email": itemEmail
	}, function(err, doc){
		if(err){
			//It fail return error - pls dont
			res.send("There was an issue with adding info to the db");
		}
		else{
			res.redirect("itemlist");
		}
	});
});

module.exports = router;

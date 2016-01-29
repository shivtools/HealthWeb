var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();

var Item = require('../models/item');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'HealthWeb' });
});

/* GET Userlist page. */
router.get('/itemlist', function(req, res) {

	console.log("im working");

	Item.find({}, function(err, items){
		if(err) throw err; //pls dont throw error
		console.log(items);
		res.render('itemlist', {
			"itemlist": items
		});
	});
});

var secretusers = ['dbrackmahn', 'nashnash', 'shivtools', 'alexissexy'];

/* GET NEW user page */
router.get('/newitem', function(req,res){
	res.render('newitem', {title: 'Add a new listing'});
});

//search functionality for website
router.post('/search', function(req,res){
	console.log("HELLO HELLO " + searchText);
	var searchText = req.body.searchQuery;


	Item.find({name: searchText}, function(err, results){
		if(err) throw err;
		//console.log(items);
		res.redirect('/searchresults', {
			"searchresults": results
		});
	});
});

// Add item to db with a post request

router.post('/additem', function(req, res){

	//get form values
	var itemName = req.body.itemname;
	var itemEmail = req.body.itememail;
	var itemNumber = req.body.itemnumber;
	var itemLocation = req.body.itemlocation;
	var itemWebsite = req.body.itemwebsite;
	var secretuser = req.body.secretkey;

	var approved = false;
	
	if(itemName == null || itemEmail == null){
		// $('#warning').modal('show');
		//handle this on the front end - warn user if sufficient details aren't entered
		//prompt them with modal to try again
		res.status(500).send({ error: 'Insufficient info for listing!' });
	}
	else if(secretusers == null || secretusers.indexOf(secretuser) == -1){
		//if you're not one of the assigned users for healthweb, bugger off.
		 res.send('You are not allowed to add listings to HealthWeb. Please get in touch with the team to request user privileges if you are part of Global Health');
		 throw err;
	}
	else{

		var itemToAdd = new Item({
			name: itemName,
			email: itemEmail,
			number: itemNumber,
			location: itemLocation,
			website: itemWebsite
		});

		itemToAdd.save(function(err){
			if(err) throw err;
			res.redirect("itemlist");
			console.log('Item added successfully wooooot!');
		});

		//render this to front end so that modal is triggered
		approved = true; //approved user
	}	
});

// Get users page - no users page as of now, but soon to come.
router.get('/users', function(req,res,next){
	mongoose.model('users').find(function(err, users){
		res.send(users);
	});
});


module.exports = router;

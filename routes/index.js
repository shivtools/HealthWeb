var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var multer = require('multer');
var fs = require('fs');
var popup = require('window-popup').windowPopup; //popups woooot!

//try connect-form to upload images
// form = require('connect-form');


//multer code
var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
  	console.log("ADDED DESTINATION PROPERLY");
    callback(null, './uploads');
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname + '-' + Date.now());
  }
});
var upload = multer({ storage : storage}).single('userPhoto');



//add all schemas for different pages
var Food = require('../models/food');
var Housing = require('../models/housing');
var Family = require('../models/family');
var Legal = require('../models/legal');
var Forms = require('../models/forms');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'HealthWeb' });
});

/* create get routes to get these pages. */
router.get('/food', function(req, res) {

	console.log("food working");

	Food.find({}, function(err, items){
		if(err) throw err; //pls dont throw error
		console.log(items);
		res.render('food', {
			title: 'Food listings',
			"foodlist": items
		});
	});
});

router.get('/housing', function(req, res) {

	console.log("housing working");

	Housing.find({}, function(err, items){
		if(err) throw err; //pls dont throw error
		console.log(items);
		res.render('housing', {
			title: 'Housing listings',
			"housinglist": items
		});
	});
});

router.get('/family', function(req, res) {

	console.log("family working"); //lol

	Family.find({}, function(err, items){
		if(err) throw err; //pls dont throw error
		console.log(items);
		res.render('family', {
			title: 'Family listings',
			"familylist": items
		});
	});
});

router.get('/legal', function(req, res) {

	console.log("legal working");

	Legal.find({}, function(err, items){
		if(err) throw err; //pls dont throw error
		console.log(items);
		res.render('legal', {
			title: 'Legal listings',
			"legallist": items
		});
	});
});

router.get('/forms', function(req, res) {

	console.log("forms working");

	Forms.find({}, function(err, items){
		if(err) throw err; //pls dont throw error
		console.log(items);
		res.render('forms', {
			title: 'Form listings',
			"formslist": items
		});
	});
});

//create environment variables later on to store allowed users. 
//give access to only one person to add listing for healthweb
secretusers = ['dbrackmahn', 'nashnash', 'shivtools', 'alexissexy'];

/* GET NEW user page */
router.get('/newitem', function(req,res){
	res.render('newitem', {title: 'Add a new listing'});
});

//search functionality for website
//I wanted to learn about promises in JS so I decided to use them to query each db
//JS is cool af

router.post('/search', function(req,res){
	var searchText = req.body.searchItem;

	var posts = []; //posts to be pushed to array

	var promise1 =  new Promise(function(resolve, reject) {

	  	Forms.find({name: searchText}, function(err, results){
			if(err) reject(Error("It broke"));

			if(results.length != 0){
				results.forEach(function(item){
					posts.push(item);
				});
			}
			resolve("Stuff worked");
		});
	});

	var promise2 =  new Promise(function(resolve, reject) {

	  	Food.find({name: searchText}, function(err, results){
			if(err) reject(Error("It broke"));

			if(results.length != 0){
				results.forEach(function(item){
					posts.push(item);
				});
			}
			resolve("Stuff worked");
		});
	});

	var promise3 =  new Promise(function(resolve, reject) {

	  	Family.find({name: searchText}, function(err, results){
			if(err) reject(Error("It broke"));

			if(results.length != 0){
				results.forEach(function(item){
					posts.push(item);
				});
			}
			resolve("Stuff worked");

		});
	});

	var promise4 =  new Promise(function(resolve, reject) {

	  	Legal.find({name: searchText}, function(err, results){
			if(err) reject(Error("It broke"));

			if(results.length != 0){
				results.forEach(function(item){
					posts.push(item);
				});
			}
			resolve("Stuff worked");
		});
	});

	var promise5 =  new Promise(function(resolve, reject) {

	  	Housing.find({name: searchText}, function(err, results){
			if(err) reject(Error("It broke"));

			if(results.length != 0){
				results.forEach(function(item){
					posts.push(item);
				});
			}
			resolve("Stuff worked");
		});
	});

	//when all promises have been fulfilled i.e all dbs queried, then render search results!
	Promise.all([promise1, promise2, promise3, promise4, promise5]).then(function() { 
			
			if(posts.length > 0){
	  			res.render('searchresults', {
					title: 'Search Results',
					"searchresults": posts
				});
	  		}
	  		else{
	  			res.render('noresults', {
	  				title: 'No results'
	  			})
	  		}
		
	});

});

//successfully added item!
router.get('/addsucess', function(req,res){
	console.log("calling add success");
	res.render('addsuccess', {title: 'Successfully added!'});
});

router.get('/delete/:Item/:id', function(req,res){
	if(secretusers.indexOf(req.cookies.user) == -1){
		res.end('You are not allowed to modify listings to HealthWeb!');
	}

	var id = req.params.id;
	var ItemType = req.params.Item;
	console.log("Type of item is: " + ItemType);
	
	//could not avoid this boilerplate code because mongodb doesn't recognize variable names!
	if(ItemType == "Forms"){
		Forms.findById(id, function(err, item){
	  		if(err) throw err;
	  		console.log(item);
	  		item.remove(function(err){
	  			console.log("Item removed!");
	  			res.render('itemremoved', {title: 'Item removed from HealthWeb'});
	  	 	});
	 	});
	}

	else if(ItemType === "Family"){
		Family.findById(id, function(err, item){
	  		if(err) throw err;
	  		item.remove(function(err){
	  			console.log("Item removed!");
	  			res.render('itemremoved', {title: 'Item removed from HealthWeb'});
	  	 	});
		});
	}

	else if(ItemType === "Housing"){
		Housing.findById(id, function(err, item){
	  		if(err) throw err;
	  		item.remove(function(err){
	  			console.log("Item removed!");
	  			res.render('itemremoved', {title: 'Item removed from HealthWeb'});
	  	 	});
		});
	}

	else if(ItemType === "Food"){
		Food.findById(id, function(err, item){
	  		if(err) throw err;
	  		item.remove(function(err){
	  			console.log("Item removed!");
	  			res.render('itemremoved', {title: 'Item removed from HealthWeb'});
	  	 	});
		});
	}

	else if(ItemType === "Legal"){
		Legal.findById(id, function(err, item){
	  		if(err) throw err;
	  		item.remove(function(err){
	  			console.log("Item removed!");
	  			res.render('itemremoved', {title: 'Item removed from HealthWeb'});
	  	 	});
	  });
	}


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

	//if the user does not have privileges, they cannot add listings
	if(secretusers == null || secretusers.indexOf(secretuser) == -1){
		//if you're not one of the assigned users for healthweb, bugger off.
		 res.end('You are not allowed to add/edit listings to HealthWeb. Please get in touch with the team to request user privileges if you are part of Global Health!');
	}

	//console.log(itemName + " email: " + itemEmail);

	console.log(__dirname);
		//multer config functions
	//image upload code
	upload(req,res,function(err) {
        if(err) {
        	console.log(err);
            return res.end("Error uploading file.");
        }
        console.log("Successfully added file");
        //res.end("File is uploaded");
    });

	//get all checkbox values
	var options = req.body.options;
	console.log(options);

	//depending on what checkboxes were marked, create items of those types and add to those dbs.

	if(options.indexOf("food") != -1){
		console.log("food");
		var food = new Food({
			name: itemName,
			email: itemEmail,
			number: itemNumber,
			location: itemLocation,
			website: itemWebsite
		});

		food.save(function(err){
			if(err) throw err;
			console.log('Food Item added successfully wooooot!');
		});
	}

	if(options.indexOf("housing") != -1){
		console.log("housing");
		var housing = new Housing({
			name: itemName,
			email: itemEmail,
			number: itemNumber,
			location: itemLocation,
			website: itemWebsite
		});

		housing.save(function(err){
			if(err) throw err;
			console.log('Item added successfully wooooot!');
		});
	}
	if(options.indexOf("family") != -1){
		console.log("family");
		var family = new Family({
			name: itemName,
			email: itemEmail,
			number: itemNumber,
			location: itemLocation,
			website: itemWebsite
		});

		family.save(function(err){
			if(err) throw err;
			console.log('Item added successfully wooooot!');
		});
	}
	if(options.indexOf("legal") != -1){
		console.log("legal");
		var legal = new Legal({
			name: itemName,
			email: itemEmail,
			number: itemNumber,
			location: itemLocation,
			website: itemWebsite
		});

		legal.save(function(err){
			if(err) throw err;
			console.log('Item added successfully wooooot!');
		});

	}
	if(options.indexOf("forms") != -1){
		console.log("forms");
		var form = new Forms({
			name: itemName,
			email: itemEmail,
			number: itemNumber,
			location: itemLocation,
			website: itemWebsite
		});

		form.save(function(err){
			if(err) throw err;
			console.log('Item added successfully wooooot!');
		});

	}
	
	if(itemName == null || itemEmail == null){
		// $('#warning').modal('show');
		//handle this on the front end - warn user if sufficient details aren't entered
		//prompt them with modal to try again
		res.status(500).send({ error: 'Insufficient info for listing!' });
	}

	if(secretusers.indexOf(secretuser) != -1){
		res.cookie('user', secretuser, { maxAge: 900000, httpOnly: true }); //set cookie in the browser with secret user's name
		console.log("Cookies: ", req.cookies); 
	}

	res.redirect('addsucess');


});

//NOTE: handle cookie security later!

// Get users page - no users page as of now, but soon to come.
router.get('/users', function(req,res,next){
	mongoose.model('users').find(function(err, users){
		res.send(users);
	});
});


module.exports = router;

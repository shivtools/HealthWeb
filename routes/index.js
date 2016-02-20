var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var multer = require('multer');
var fs = require('fs');
var popup = require('window-popup').windowPopup; //popups woooot!

var authenticated = false; //variable to pass to front end to check is user has privileges.

//try connect-form to upload images
// form = require('connect-form');

var nodemailer = require('sendgrid')('healthweb','Richmond15');

//add all schemas for different pages
var Food = require('../models/food');
var Housing = require('../models/housing');
var Family = require('../models/family');
var Legal = require('../models/legal');
var Forms = require('../models/forms');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Home | HealthWeb' });
});

/* create get routes to get these pages. */
router.get('/food', function(req, res) {

	console.log("food working");

	Food.find({}, function(err, items){
		if(err) throw err; //pls dont throw error
		console.log(items);
		res.render('food', {
			title: 'Food listings',
			user: authenticated,
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
			user: authenticated,
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
			user: authenticated,
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
			user: authenticated,
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
			user: authenticated,
			"formslist": items
		});
	});
});

router.get('/itemremoved', function(req,res){
	res.render('itemremoved', {title: 'Removed item | HealthWeb'});
});

//create environment variables later on to store allowed users. 
//give access to only one person to add listing for healthweb
var secretusers = ['dbrackmahn', 'nashnash', 'shivtools', 'alexissexy'];

/* GET NEW user page */
router.get('/newitem', function(req,res){
	res.render('newitem', {title: 'Add a new listing | HealthWeb'});
});

router.get('/contact', function(req,res){
	res.render('contact', {title: 'Contact us | HealthWeb'});
});

router.get('/volunteer', function(req,res){
	res.render('volunteer', {title: 'Volunteer | HealthWeb'});
});

router.get('/about', function(req,res){
	res.render('about', {title: 'About HealthWeb | HealthWeb'});
});

//search functionality for website
//I wanted to learn about promises in JS so I decided to use them to query each db
//JS is cool af

router.post('/search', function(req,res){
	var searchText = req.body.searchItem;

	var posts = []; //posts to be pushed to array

	var promise1 =  new Promise(function(resolve, reject) {

	  	Forms.find({name: {$regex: new RegExp(searchText, "i")}}, function(err, results){
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

	  	Food.find({name: {$regex: new RegExp(searchText, "i")}}, function(err, results){
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

	  	Family.find({name: {$regex: new RegExp(searchText, "i")}}, function(err, results){
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

	  	Legal.find({name: {$regex: new RegExp(searchText, "i")}}, function(err, results){
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

	  	Housing.find({name: {$regex: new RegExp(searchText, "i")}}, function(err, results){
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

//post request for sending email
router.post('/sendemail', function(req,res){
	var contactName = req.body.name;
	var contactEmail = req.body.email;
	var contactNumber = req.body.tel;
	var optionSelected = req.body.select;
	var contactOther = req.body.other;
	var contactMessage = req.body.message;

	sendEmail(contactName, contactEmail, contactNumber, optionSelected, contactOther, contactMessage);

	res.render('emailsuccess', {title: 'Thank you!'});


});

//Sends an email to HealthWeb's email address with message and user details
var sendEmail = function email(contactName, contactEmail, contactNumber, optionSelected, contactOther, contactMessage){
	//Added email template for selling emails
	var email_message = "Hey there, HealthWeb just received a message from: " + contactName + ". Their email id is: " + contactEmail + " and their number is: " + contactNumber + ".\n";
	var email_message2 = "\n They're getting in touch about: " + optionSelected + ". Other information they provided is: " + contactOther + ".\n \n";
	var email_message3 = "The message they left for you is: \n \n" + contactMessage;
 
	var msg = new nodemailer.Email();
	msg.addTo("rvahealthweb@gmail.com");
	msg.setFrom('Contact request <rvahealthweb@sendgrid.com>');
	msg.setSubject("Request for information from: " + contactName);
	msg.setHtml(email_message + email_message2 + email_message3); // plaintext body


	    // send mail with defined sendmail object
	nodemailer.send(msg, function(error, info){
	    if(error){
	        console.log(error);
	    }else{
	        console.log('Message sent!');
	    }
	});


}

//successfully sent email to HealthWeb team!
router.get('/addsuccess', function(req,res){
	console.log("calling add success");
	res.render('addsuccess', {title: 'Successfully added!'});
});



//successfully added item!
router.get('/addsuccess', function(req,res){
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
	  			res.redirect('/itemremoved');
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

router.get('/login', function(req, res){
	console.log("sending cookie");
	authenticated = true;
	res.cookie('user', "secretuser", { maxAge: 900000, httpOnly: true }); //set cookie in the browser with secret user's name
	res.render('login', {title: 'Successfully logged in!'});
});

// Add item to db with a post request

router.post('/additem', function(req, res){

	//get form values
	var itemName = req.body.itemname;
	var itemEmail = req.body.itememail;
	var itemNumber = req.body.itemnumber;
	var itemLocation = req.body.itemlocation;
	var itemWebsite = req.body.itemwebsite;
	console.log(itemWebsite);
	var secretuser = req.body.secretkey;

	if(secretusers.indexOf(secretuser) != -1){
		console.log("sending cookie");
		authenticated = true;
		res.cookie('user', secretuser, { maxAge: 900000, httpOnly: true }); //set cookie in the browser with secret user's name
	}

	//if the user does not have privileges, they cannot add listings
	if(secretusers == null || secretusers.indexOf(secretuser) == -1){
		//if you're not one of the assigned users for healthweb, bugger off.
		 res.send('You are not allowed to add/edit listings to HealthWeb. Please get in touch with the team to request user privileges if you are part of Global Health!');
	}


	
	//get all checkbox values
	var options = req.body.options;
	console.log("OPTIONS: " + options);

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

	res.redirect('addsuccess');
});

//NOTE: handle cookie security later!

// Get users page - no users page as of now, but soon to come.
router.get('/users', function(req,res,next){
	mongoose.model('users').find(function(err, users){
		res.send(users);
	});
});


module.exports = router;

var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var multer = require('multer');
var fs = require('fs');
var popup = require('window-popup').windowPopup; //popups woooot!

var authenticated = false; //variable to pass to front end to check is user has privileges.
var userCanDelete = false; //variable to keep track of whether the user is authorized to delete entries


//Get account credentials from environment variables
var nodemailer = require('sendgrid')(process.env.SENDGRID_USERNAME, process.env.SENDGRID_PASSWORD);

//add all schemas for different pages
var Food = require('../models/food');
var Housing = require('../models/housing');
var Family = require('../models/family');
var Legal = require('../models/legal');
var Health = require('../models/health');
var Education = require('../models/education');
var Health = require('../models/health');
var Employment = require('../models/employment');
var Dental = require('../models/dental');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {
        title: 'Home | HealthWeb'
    });
});

/* GET food page with corresponding posts */
router.get('/food', function(req, res) {

    //Query MongoDB and return all Food items
    Food.find({}, function(err, items) {
        if (err) throw err; //pls dont throw error
        console.log(items);
        res.render('food', {
            title: 'Food listings',
            user: authenticated,
            "foodlist": items
        });
    });
});

/* GET housing page with corresponding posts */
router.get('/housing', function(req, res) {

    //Query MongoDB and return all Housing items
    Housing.find({}, function(err, items) {
        if (err) throw err; //pls dont throw error
        console.log(items);
        res.render('housing', {
            title: 'Housing listings',
            user: authenticated,
            "housinglist": items
        });
    });
});

/* GET family page with corresponding posts */
router.get('/family', function(req, res) {

    //Query MongoDB and return all Family items
    Family.find({}, function(err, items) {
        if (err) throw err; //pls dont throw error
        console.log(items);
        res.render('family', {
            title: 'Family listings',
            user: authenticated,
            "familylist": items
        });
    });
});

/* GET legal page with corresponding posts */
router.get('/legal', function(req, res) {

    //Query MongoDB and return all Legal items
    Legal.find({}, function(err, items) {
        if (err) throw err; //pls dont throw error
        console.log(items);
        res.render('legal', {
            title: 'Legal listings',
            user: authenticated,
            "legallist": items
        });
    });
});

/* GET forms page with corresponding posts */
router.get('/forms', function(req, res) {

    //Query MongoDB and return all Forms items
    Forms.find({}, function(err, items) {
        if (err) throw err; //pls dont throw error
        console.log(items);
        res.render('forms', {
            title: 'Form listings',
            user: authenticated,
            "formslist": items
        });
    });
});

/* GET education page with corresponding posts */
router.get('/education', function(req, res) {

    //Query MongoDB and return all Education items
    Education.find({}, function(err, items) {
        if (err) throw err; //pls dont throw error
        console.log(items);
        res.render('education', {
            title: 'Education listings',
            user: authenticated,
            "educationlist": items
        });
    });
});

/* GET health page with corresponding posts */
router.get('/health', function(req, res) {

    //Query MongoDB and return all Health items
    Health.find({}, function(err, items) {
        if (err) throw err; //pls dont throw error
        console.log(items);
        res.render('health', {
            title: 'Health listings',
            user: authenticated,
            "healthlist": items
        });
    });
});

/* GET employment page with corresponding posts */
router.get('/employment', function(req, res) {

    //Query MongoDB and return all Employment items
    Employment.find({}, function(err, items) {
        if (err) throw err; //pls dont throw error
        console.log(items);
        res.render('employment', {
            title: 'Employment listings',
            user: authenticated,
            "employmentlist": items
        });
    });
});

/* create get routes to get these pages. */
router.get('/dental', function(req, res) {

    //Query MongoDB and return all Dental items
    Dental.find({}, function(err, items) {
        if (err) throw err; //pls dont throw error
        console.log(items);
        res.render('dental', {
            title: 'Dental listings',
            user: authenticated,
            "dentallist": items
        });
    });
});

//Environment variables that store secret user names (to add entries to database)
var secretusers = ['shivtools', process.env.SECRET_USER0, process.env.SECRET_USER1, process.env.SECRET_USER2, process.env.SECRET_USER3];

/* GET item removed page to tell user item was removed */
router.get('/itemremoved', function(req, res) {
    res.render('itemremoved', {
        title: 'Removed item | HealthWeb'
    });
});

/* GET new item page where user can add new posts */
router.get('/newitem', function(req, res) {
    res.render('newitem', {
        title: 'Add a new listing | HealthWeb'
    });
});

/* GET contact page where user can send HealthWeb an email */
router.get('/contact', function(req, res) {
    res.render('contact', {
        title: 'Contact us | HealthWeb'
    });
});

/* GET volunteer page*/
router.get('/volunteer', function(req, res) {
    res.render('volunteer', {
        title: 'Volunteer | HealthWeb'
    });
});

/* GET about page*/
router.get('/about', function(req, res) {
    res.render('about', {
        title: 'About HealthWeb | HealthWeb'
    });
});

/* GET page to prompt user that item was added successfully */
router.get('/addsuccess', function(req, res) {
    // console.log("calling add success");
    res.render('addsuccess', {
        title: 'Successfully added!'
    });
});

/* GET page to prompt user that item was not added properly */
router.get('/addfail', function(req, res) {
    // console.log("calling add fail");
    res.render('addfail', {
        title: 'Failed to authenticate!'
    });
});

//When user searches for item, several MongoDB databases are queried for results
//JS promises are used to query each db. When all dbs are queried, results are returned as an array
router.post('/search', function(req, res) {
    var searchText = req.body.searchItem;

    var posts = []; //Array that all posts found will be pushed to

    //Query Food DB and push results to posts
    var foodPromise = new Promise(function(resolve, reject) {

        Food.find({
            name: {
                $regex: new RegExp(searchText, "i")
            }
        }, function(err, results) {
            if (err) reject(Error("Could not query Food database"));

            if (results.length != 0) {
                results.forEach(function(item) {
                    posts.push(item);
                });
            }
            resolve("Stuff worked");
        });
    });

    //Query Family DB and push results to posts
    var familyPromise = new Promise(function(resolve, reject) {

        Family.find({
            name: {
                $regex: new RegExp(searchText, "i")
            }
        }, function(err, results) {
            if (err) reject(Error("Could not query family database"));

            if (results.length != 0) {
                results.forEach(function(item) {
                    posts.push(item);
                });
            }
            resolve("Stuff worked");

        });
    });

    //Query Legal DB and push results to posts
    var legalPromise = new Promise(function(resolve, reject) {

        Legal.find({
            name: {
                $regex: new RegExp(searchText, "i")
            }
        }, function(err, results) {
            if (err) reject(Error("Could not query legal database"));

            if (results.length != 0) {
                results.forEach(function(item) {
                    posts.push(item);
                });
            }
            resolve("Stuff worked");
        });
    });

    //Query Housing DB and push results to posts
    var housingPromise = new Promise(function(resolve, reject) {

        Housing.find({
            name: {
                $regex: new RegExp(searchText, "i")
            }
        }, function(err, results) {
            if (err) reject(Error("Could not query housing database"));

            if (results.length != 0) {
                results.forEach(function(item) {
                    posts.push(item);
                });
            }
            resolve("Stuff worked");
        });
    });

    //Query Education DB and push results to posts
    var educationPromise = new Promise(function(resolve, reject) {

        Education.find({
            name: {
                $regex: new RegExp(searchText, "i")
            }
        }, function(err, results) {
            if (err) reject(Error("Could not query education database"));

            if (results.length != 0) {
                results.forEach(function(item) {
                    posts.push(item);
                });
            }
            resolve("Stuff worked");

        });
    });

    //Query Health DB and push results to posts
    var healthPromise = new Promise(function(resolve, reject) {

        Health.find({
            name: {
                $regex: new RegExp(searchText, "i")
            }
        }, function(err, results) {
            if (err) reject(Error("Could not query health database"));

            if (results.length != 0) {
                results.forEach(function(item) {
                    posts.push(item);
                });
            }
            resolve("Stuff worked");

        });
    });

    //Query Employment DB and push results to posts
    var employmentPromise = new Promise(function(resolve, reject) {

        Employment.find({
            name: {
                $regex: new RegExp(searchText, "i")
            }
        }, function(err, results) {
            if (err) reject(Error("Could not query Employment database"));

            if (results.length != 0) {
                results.forEach(function(item) {
                    posts.push(item);
                });
            }
            resolve("Stuff worked");

        });
    });

    //Query Dental DB and push results to posts
    var dentalPromise = new Promise(function(resolve, reject) {

        Dental.find({
            name: {
                $regex: new RegExp(searchText, "i")
            }
        }, function(err, results) {
            if (err) reject(Error("Could not query dental database"));

            if (results.length != 0) {
                results.forEach(function(item) {
                    posts.push(item);
                });
            }
            resolve("Stuff worked");

        });
    });

    //when all promises have been fulfilled i.e all dbs queried, then render search results!
    Promise.all([foodPromise, familyPromise, legalPromise, housingPromise, educationPromise, healthPromise, employmentPromise, dentalPromise]).then(function() {

        //If search returned results from one (or more) of many databases, then return results to user
        if (posts.length > 0) {
            res.render('searchresults', {
                title: 'Search Results',
                "searchresults": posts
            });
        }
        //Else return no results
        else {
            res.render('noresults', {
                title: 'No results'
            })
        }

    });

});

/* POST request to handle sending email to HealthWeb email address */
router.post('/sendemail', function(req, res) {

    //Fetch data from form
    var contactName = req.body.name;
    var contactEmail = req.body.email;
    var contactNumber = req.body.tel;
    var optionSelected = req.body.select;
    var contactOther = req.body.other;
    var contactMessage = req.body.message;

    //Pass data to sendEmail function. Email is sent using SendGrid
    sendEmail(contactName, contactEmail, contactNumber, optionSelected, contactOther, contactMessage);

    //Thank user :)
    res.render('emailsuccess', {
        title: 'Thank you!'
    });

});

//Sends an email to HealthWeb's email address with message and user details
var sendEmail = function email(contactName, contactEmail, contactNumber, optionSelected, contactOther, contactMessage) {
    //Added email template for selling emails
    var email_template = "<p><span class='sg-image' style='float: none; display: block; text-align: center;'><img height='128'" +
        "src='https://raw.githubusercontent.com/shivtools/HealthWeb/master/public/images/logo.jpg'" +
        "style='height: 128px;'/></span></p>" +
        "<p style='text-align: center;'><span style='font-size:28px;'><span style='font-family:comic sans ms,cursive;'>HealthWeb</span></span></p>" +
        "<p style='text-align: center;'><span style='font-size:16px;'><span style='font-family:georgia,serif;'>";

    var email_message = "Hey there, HealthWeb just received a message from: <strong>" + contactName + "</strong>. Their email id is: <strong>" + contactEmail + "</strong> and their number is: <strong>" + contactNumber + "</strong>.\n";
    var email_message2 = "\n They're getting in touch about:<strong>" + optionSelected + "</strong>. Other information they provided is: <em>" + contactOther + "</em>.\n \n";
    var email_message3 = "The message they left for you is: \n \n<em>" + contactMessage + "</em>";

    var msg = new nodemailer.Email();
    msg.addTo("rvahealthweb@gmail.com");
    msg.setFrom('Contact request <rvahealthweb@sendgrid.com>');
    msg.setSubject("Request for information from: " + contactName);
    msg.setHtml(email_template + email_message + email_message2 + email_message3); // plaintext body


    // send mail with defined sendmail object
    nodemailer.send(msg, function(error, info) {
        if (error) {
            console.log("Could not send email via SendGrid ", error);
        } else {
            console.log('Message sent via SendGrid!');
        }
    });
}

/* For given item ID, delete the particular item from MongoDB database */
router.get('/delete/:Item/:id', function(req, res) {

    //Get id of element from request
    var id = req.params.id;
    var ItemType = req.params.Item;

    //Depending on the item type of the post, delete it from respective database
    if (ItemType == "Forms") {
        Forms.findById(id, function(err, item) {
            if (err) throw err;
            // console.log(item);
            item.remove(function(err) {
                res.redirect('/itemremoved');
            });
        });
    } else if (ItemType === "Family") {
        Family.findById(id, function(err, item) {
            if (err) throw err;
            item.remove(function(err) {
                res.redirect('/itemremoved');
            });
        });
    } else if (ItemType === "Housing") {
        Housing.findById(id, function(err, item) {
            if (err) throw err;
            item.remove(function(err) {
                res.redirect('/itemremoved');
            });
        });
    } else if (ItemType === "Food") {
        Food.findById(id, function(err, item) {
            if (err) throw err;
            item.remove(function(err) {
                res.redirect('/itemremoved');
            });
        });
    } else if (ItemType === "Legal") {
        Legal.findById(id, function(err, item) {
            if (err) throw err;
            item.remove(function(err) {
                res.redirect('/itemremoved');
            });
        });
    } else if (ItemType === "Education") {
        Education.findById(id, function(err, item) {
            if (err) throw err;
            item.remove(function(err) {
                res.redirect('/itemremoved');
            });
        });
    } else if (ItemType === "Health") {
        Health.findById(id, function(err, item) {
            if (err) throw err;
            item.remove(function(err) {
                res.redirect('/itemremoved');
            });
        });
    } else if (ItemType === "Employment") {
        Employment.findById(id, function(err, item) {
            if (err) throw err;
            item.remove(function(err) {
                res.redirect('/itemremoved');
            });
        });
    } else if (ItemType === "Dental") {
        Dental.findById(id, function(err, item) {
            if (err) throw err;
            item.remove(function(err) {
                res.redirect('/itemremoved');
            });
        });
    }


});

router.get('/login', function(req, res) {
    authenticated = true;
    res.cookie('user', "secretuser", {
        maxAge: 900000,
        httpOnly: true
    });
    res.render('login', {
        title: 'Successfully logged in!'
    });
});

/* Add item to relevant DB with a post request */
router.post('/additem', function(req, res) {

    //Get form values from front-end form
    var itemName = req.body.itemname;
    var itemServices = req.body.itemservices;
    var itemNumber = req.body.itemnumber;
    var itemLocation = req.body.itemlocation;
    var itemWebsite = req.body.itemwebsite;
    var itemHours = req.body.itemhours;
    var itemRequirements = req.body.itemrequirements;
    var itemLogoURL = req.body.itemLogoURL; //URL for image - to be hosted on Imgur or a service. App will render image from URL.
    var secretuser = req.body.secretkey;

    if (secretusers.indexOf(secretuser) != -1) {
        // console.log("sending cookie");
        userCanDelete = true;
        res.cookie('user', secretuser, {
            maxAge: 900000,
            httpOnly: true
        }); //set cookie in the browser with secret user's name
    }

    //if the user does not have privileges, they cannot add listings
    if (!(userCanDelete && authenticated)) {
        res.send('Failed');
    }

    //If the user does have privileges, then go ahead and save entry in database
    else {

        //Get all checkbox values from form
        var options = req.body.options;
        console.log("OPTIONS: " + options);

        //Depending on what checkboxes were marked, create items of those types and add to those dbs.
        if (options.indexOf("food") != -1) {

            var food = new Food({
                name: itemName,
                number: itemNumber,
                location: itemLocation,
                imageURL: itemLogoURL,
                services: itemServices,
                requirements: itemRequirements,
                hours: itemHours,
                website: itemWebsite,
                user: secretuser
            });

            food.save(function(err) {
                if (err) {
                    throw err;
                }
            });
        }

        if (options.indexOf("housing") != -1) {

            var housing = new Housing({
                name: itemName,
                number: itemNumber,
                location: itemLocation,
                imageURL: itemLogoURL,
                services: itemServices,
                requirements: itemRequirements,
                hours: itemHours,
                website: itemWebsite,
                user: secretuser
            });

            housing.save(function(err) {
                if (err) throw err;
            });
        }
        if (options.indexOf("family") != -1) {

            var family = new Family({
                name: itemName,
                number: itemNumber,
                location: itemLocation,
                imageURL: itemLogoURL,
                services: itemServices,
                requirements: itemRequirements,
                hours: itemHours,
                website: itemWebsite,
                user: secretuser
            });

            family.save(function(err) {
                if (err) throw err;
            });
        }
        if (options.indexOf("legal") != -1) {

            var legal = new Legal({
                name: itemName,
                number: itemNumber,
                location: itemLocation,
                imageURL: itemLogoURL,
                services: itemServices,
                requirements: itemRequirements,
                hours: itemHours,
                website: itemWebsite,
                user: secretuser
            });

            legal.save(function(err) {
                if (err) throw err;
            });

        }
        if (options.indexOf("health") != -1) {

            var health = new Health({
                name: itemName,
                number: itemNumber,
                location: itemLocation,
                imageURL: itemLogoURL,
                services: itemServices,
                requirements: itemRequirements,
                hours: itemHours,
                website: itemWebsite,
                user: secretuser
            });

            health.save(function(err) {
                if (err) throw err;
            });

        }
        if (options.indexOf("education") != -1) {

            var education = new Education({
                name: itemName,
                number: itemNumber,
                location: itemLocation,
                imageURL: itemLogoURL,
                services: itemServices,
                requirements: itemRequirements,
                hours: itemHours,
                website: itemWebsite,
                user: secretuser
            });

            education.save(function(err) {
                if (err) throw err;
            });

        }

        if (options.indexOf("employment") != -1) {

            var employment = new Employment({
                name: itemName,
                number: itemNumber,
                location: itemLocation,
                imageURL: itemLogoURL,
                services: itemServices,
                requirements: itemRequirements,
                hours: itemHours,
                website: itemWebsite,
                user: secretuser
            });

            employment.save(function(err) {
                if (err) throw err;
            });

            if (options.indexOf("dental") != -1) {

                var dental = new Dental({
                    name: itemName,
                    number: itemNumber,
                    location: itemLocation,
                    imageURL: itemLogoURL,
                    services: itemServices,
                    requirements: itemRequirements,
                    hours: itemHours,
                    website: itemWebsite,
                    user: secretuser
                });

                dental.save(function(err) {
                    if (err) throw err;
                });

            }

        }

        res.send('Success');
    }
});

// Get users page - no users page as of now, but soon to come.
router.get('/users', function(req, res, next) {
    mongoose.model('users').find(function(err, users) {
        res.send(users);
    });
});

//Make router available to entire app.
module.exports = router;

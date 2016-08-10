# HealthWeb

HealthWeb is a forum connecting the Richmond community with comprehensive social health resources.

## Motivation

 Inspired by Health Leads, HealthWeb is a Richmond-based, student-run club where we work with patients from CrossOver Ministries to help them get access to the resources they need. This web app was created by ACM's Web Dev group for use by the [Global Health](http://livinglearning.richmond.edu/ssir/global-health/index.html) Sophomore Scholars in Residence (living and learning) program at the University of Richmond and [CrossOver](http://www.crossoverministry.org/).

## Functionality

HealthWeb uses Mongoose schemas to store different types of listings (e.g Family, Food, Legal) listings. These are stored in a MongoDB instance in the cloud (using MongoCloud).

![Listings](https://raw.githubusercontent.com/shivtools/HealthWeb/master/markdown/listing1.png)

![Listings](https://raw.githubusercontent.com/shivtools/HealthWeb/master/markdown/listing2.png)

The main functionality of HealthWeb is to access these listings and easily fetch data about an organizations location and how far it is from one of their clients' house. HealthWeb makes use of Google Maps' API to pin point (with a marker) the organizations locaiton. The user can input their own home address and HealthWeb will reorient the origin of the map to the user's location. When a user clicks on a listing or on a marker, the map will display the shortest route between origin and destination for the user's convenience (while also telling them how far and how long it will take to get to this location).

![Google Maps](https://raw.githubusercontent.com/shivtools/HealthWeb/master/markdown/googlemaps.png)

HealthWeb also provides functionality to send emails to HealthWeb's email address (rvahealthweb@gmail.com), using the SendGrid API. User's can send this email address an email using our 'Contact Us' form.

![Contact us](https://raw.githubusercontent.com/shivtools/HealthWeb/master/markdown/contactus.png)
![Email](https://raw.githubusercontent.com/shivtools/HealthWeb/master/markdown/email.png)

HealthWeb also makes use of browser cookies to create a local session which when logged into (to be used by administrator only!).

## Our Stack

HealthWeb is a [Node.js](https://nodejs.org/en/)/[Express app](http://expressjs.com/en/guide/using-middleware.html) that uses [Jade](http://jade-lang.com/) as its templating engine. Our geolocation and Maps data is provided by [Google Maps](https://developers.google.com/maps/), SendGrid is used for sending emails to our local email ID.

## Developers

We are all part of ACM's Web Development group and worked very hard to bring you HealthWeb. Shoutout to all the developers in the house!

* [Shiv Toolsidass](https://github.com/shivtools) - full stack engineer and project manager for HealthWeb. Built the backend for Healthweb using Node.js, added SSL functionality and built a login system. I currently work on scaling, maintaining and securing the website.
* [Nasheya Rahman](https://github.com/nasheya) - project manager and front end guru for HealthWeb.  Crafted and engineered HealthWeb's beautiful front-end!
* [Matt Santa](https://github.com/vsantav) - mapping ninja who made HealthWeb's mapping feature possible. He began coding a few months ago but is already a pro!
* [Michael Dombrowski](https://github.com/md100play) - coding hero who I must thank for all of your assistance with our maps and for your ideas on authentication!
* [David Brakman](https://github.com/dbrakman) - front-end engineer
* [Ruth Dumay](https://github.com/monroi) - front-end engineer
* [Alan Malayev](https://github.com/alan459) - front-end engineer


## License:

Create Commons License. Feel free to fork this repo and improve upon our existing codebase!

### Instructions on how to set up this app and run it locally in your browser:

In case you'd like to use this app and develop it further, this will be tell you how to run it locally on your computer!
Note that this will code is meant for a Mac/Unix environment. If you have Windows, you'll have to download the Node.js msi file from the node website. Here are step by step instructions:

*Note:* If you have Windows, you'll have to use Git Bash to do the following!

* You'll need to head over to the Node.js web page to install the node package. With this you'll get npm (the package manager that we will use to install dependencies for our app) to get our app running. [Visit the nodejs download page](https://nodejs.org/en/download/) and follow the instructions depending on which OS you have.

* Once you have that installed, navigate to the directory where you have cloned a copy of this repo and use the following commands:

```
npm install
npm start
```

* The node app will then run locally on your computer. If you see the following (with a different directory based on where you've placed your files, the app has booted up properly).

```
> HealthWeb@0.0.0 start /Users/shivtoolsidass/Desktop/Tutorials/HealthWeb
> node ./bin/www

```


 To head to the port that the app runs on, type the following into your web browser:

```
http://localhost:3000
```

* Please make all of your changes in separate branches and do not commit to the master branch (I've made this mistake countless times and it is a pain to refactor code). To figure out how to branch, use this [git tutorial](http://rogerdudler.github.io/git-guide/).

* Feel free to reach out with questions!

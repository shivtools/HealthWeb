var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//connecting to database
var mongo = require('mongodb');

var mongoose = require('mongoose'); 
var routes = require('./routes/index');
var users = require('./routes/users');

//link db to localhost for the time being. 
//once app is deployed, will connect to mongolab

mongoose.connect('mongodb://localhost/healthweb');

//To be connected once deployed on digital ocean or any other hosting service.
//remember to include host in url in connect.js
//dbconnection = require('./config/connect.js')

var fs = require('fs'); //file system to load in models 

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/* Commented out since we are using mongoose and not monk*/
//Make db accessible to router.
// app.use(function(req,res,next){
//     req.db = db; //add monk collection object to every http request that app makes
//     next();
// });

//middleware for express 
app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });

}

//load up models in models dir into app using fs from models directory
fs.readdirSync(__dirname + '/models').forEach(function(filename){
  //console.log(filename);
  if(~filename.indexOf('.js')) require(__dirname + '/models/' + filename);
});


module.exports = app;

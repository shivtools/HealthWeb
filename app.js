var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var flash = require('connect-flash');
var passport = require('passport');
var flash = require('connect-flash');
var session = require('express-session');
var configs = require('./config/config.json');
var mongo = require('mongodb');
var mongoose = require('mongoose');

var users = require('./routes/users');

//link db to localhost for the time being.
//once app is deployed, will connect to mongolab
mongoose.connect(configs.MONGO_URL);

//attach lister to connected event
mongoose.connection.once('connected', function() {
	console.log("Connected to database")
});

var fs = require('fs'); //file system to load in models

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Initialize Passport

app.use(session({
    secret: configs.SESSION_SECRET
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

app.use(flash());

var initPassport = require('./passport/init');
initPassport(passport);

var routes = require('./routes/index')(passport);
//middleware for express
app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

//load up models in models dir into app using fs from models directory
fs.readdirSync(__dirname + '/models').forEach(function (filename) {
    //console.log(filename);
    if (~filename.indexOf('.js')) require(__dirname + '/models/' + filename);
});


module.exports = app;

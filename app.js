var express = require('express');
var app = express();
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var nunjucks= require('nunjucks');
var mongodb= require('mongodb');
var MongoClient= mongodb.MongoClient;
var URL = "mongodb://rajireddy:themongolabserver@ds031922.mongolab.com:31922/maindb";
//var URL = 'mongodb://127.0.0.1:27017/mainDB';
//var config= require('config');

var login = require('./routes/login').router;
var users = require('./routes/users');
var signup = require('./routes/signup').router;
var home = require('./routes/home').router;
var poll = require('./routes/poll').router;

/*
var env = new nunjucks.Environment(new nunjucks.FileSystemLoader(config.root + './views'));
env.express(app);
*/

var _templates = process.env.NODE_PATH ? process.env.NODE_PATH + '/views' : 'views' ;
nunjucks.configure( _templates, {
    autoescape: true,
    cache: false,
    express: app
} ) ;

// view engine setup

app.engine( 'html', nunjucks.render ) ;
app.set( 'view engine', 'html' ) ;

//app.set('view engine', 'jade');
//app.set('views', path.join(__dirname, 'views'));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
//app.use(express.bodyParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/login', login);
app.use('/users', users);
app.use('/signup', signup);
app.use('/', home);
app.use('/poll', poll);

MongoClient.connect(URL,function(err,database){
  if(!err){
    //var db1=MongoClient.db('dev-db');
    db=database;
    console.log("seems like a success");
  }
  else{
    console.log("A FAILURE");
  }
});

//app.set('db',db);
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

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
//module.exports = {'db':db};
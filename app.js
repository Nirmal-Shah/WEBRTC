/**
 * Module dependencies.
 */

//Main module which runs the whole application:: Deepak Tiwari


var express = require('express')
 , routes = require('./routes')
  , routepath = require('./routes/route')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');


//modules imported from node_modules directory.
  var mongoose = require('mongoose');
 var bodyParser=require('body-parser');
 var cookieParser=require('cookie-parser');
 var logger=require('morgan');
 var errorhandler = require('errorhandler');
 var methodOverride = require('method-override');
 var favicon = require('serve-favicon');
 var  passport = require('passport');
  var LocalStrategy = require('passport-local').Strategy;
  var passport_http = require('passport-http');
  var flash = require('connect-flash');
  var session = require('express-session');
//var mongoose = require('mongoose');
//var myroom=require('./model/roommodel');







//var Room=require('./model/room');


var app = express();











 app.use(express.static(path.join(__dirname, 'public')));
  app.use(cookieParser());
  app.use(bodyParser());
  app.use(session({ secret: 'mysecretkey' }));
  app.use(passport.initialize());
  app.use(passport.session());
  
// app.use(flash()); 


 
app.use('/',routepath);




//var rooms=myroom.rooms;
// all environments
 app.use(methodOverride('X-HTTP-Method-Override'));
 if (process.env.NODE_ENV === 'development') {
  // only use in development
  app.use(errorhandler());
}



 app.enable('trust proxy');
 app.set('port', process.env.PORT || 3300);
 app.set('views', __dirname + '/views');
 app.set('view engine', 'ejs');
 


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});


app.use(function(err, req, res, next) {
    res.status(err.status || 500);
});



module.exports = app;



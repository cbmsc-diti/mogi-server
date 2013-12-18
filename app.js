/**
 * Module dependencies.
 */
var express = require('express')
  , http = require('http')
  , passport = require('passport')
  , db = require('./lib/db')
  , users = require('./lib/users');
  
  
// Express configuration
  
var app = express();
app.set('port', process.env.PORT || 3000);
app.use(express.logger('dev'));
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(passport.initialize());
app.use('/api', app.router);
app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));

// Passport configuration
var auth = require('./lib/auth');

app.post('/token', auth.token);
app.use(require('./lib/users'));
app.use(require('./lib/streams'));
app.use(require('./lib/videos'));
app.use(require('./lib/locations'));

db.sequelize.sync({ force : true }).complete(function(err) {
  if (err) {
    throw err;
  } else {
    db.seed();
    http.createServer(app).listen(app.get('port'), function(){
      console.log('Express server listening on port ' + app.get('port'));
    });    
  }
});
/**
 * Module dependencies.
 */
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , BearerStrategy = require('passport-http-bearer').Strategy
  , moment = require('moment')
  , db = require('./../db')
  , config = require('./../config')
  , jwt = require('jwt-simple');


/**
 * LocalStrategy
 *
 * Validates the user and creates the accessToken
 */
passport.use(new LocalStrategy({ passReqToCallback: true },
  function(req, username, password, done) {
    db.User.find({ where : { username : username}}).success(function(user) {
      if (!user) { return done(null, false); }
      user.validatePassword(password, function(valid) {
        if (!valid ) return done(null, false);
        if ( req.body.scope && req.body.scope.indexOf('admin') > -1 && !user.isAdmin ) {
          return done(null, false);
        }
        return done(null, user);
      });
    });
  }
));

/**
 * BearerStrategy
 *
 * Validates the token
 */
var validateBearerToken = function(accessToken, done) {
  var decodedToken = jwt.decode(accessToken, config.tokenSecret);

  if ( decodedToken.exp < moment().add('m', 10).valueOf() ) {
    console.log("Token expirado", decodedToken.exp, moment().add('m', 10).valueOf());
    return done(null, false);
  }

  db.AccessToken.find(decodedToken.sub).success(function(token) {
    if (!token) return done(null, false);
    if (token.expirationDate < new Date()) return done(null, false);

    token.getUser().success(function(user) {
      if (!user) return done(null, false);

      var info = { scope : token.scope };
      done(null, user, info);
    });
  });
};

passport.use(new BearerStrategy(validateBearerToken));

exports.validateToken = validateBearerToken;

exports.tokenEndpoint = [
  passport.authenticate('local', { session : false }),
  function (req, res) {
    var expiration = moment().add('m', config.tokenDuration);
    db.AccessToken.create({
      scope : req.body.scope,
      expirationDate : expiration.toDate(),
      UserId: req.user.id
    }).success(function (token) {
        var encodedToken = jwt.encode({
            iss : config.tokenIssuer,
            sub : token.id,
            exp : expiration.valueOf()
        }, config.tokenSecret);

        if ( req.body.scope === 'client' && req.body.gcm_registration ) {
            req.user.gcmRegistration = req.body.gcm_registration;
            req.user.save(['gcmRegistration']);
        }

//            res.send(200, {
//                token: encodedToken,
//                serverIp: '1234'
//            });

      res.send(200, encodedToken);
    });
  }
];

exports.ensureToken = passport.authenticate('bearer', { session : false });

exports.ensureAdmin = function (req, res, next) {
  passport.authenticate('bearer', function(err, user, info) {
    if (err) { return next(err); }
    if (!user) { return res.send(401); }
    if ( req.authInfo && req.authInfo.scope && req.authInfo.scope.indexOf('admin') === -1 ) {
      return res.send(401,"invalid_scope");
    }

    next();
  })(req, res, next);
};

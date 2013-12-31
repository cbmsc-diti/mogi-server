var fs        = require('fs')
  , path      = require('path')
  , Sequelize = require('sequelize')
  , moment    = require('moment')
  , jwt       = require('jwt-simple')
  , lodash    = require('lodash')
  , config    = require('./../config')
  , sequelize = new Sequelize(config.db, { dialect : 'postgres', logging: false })
  , db        = {};

fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf('.') !== 0) && (file !== 'index.js')
  })
  .forEach(function(file) {
    var model = sequelize.import(path.join(__dirname, file))
    db[model.name] = model
  })
 
Object.keys(db).forEach(function(modelName) {
  if (db[modelName].options.hasOwnProperty('associate')) {
    db[modelName].options.associate(db)
  }
})

db.seed = function() {
  var user = db.User.build({ username : 'felipe', email : 'felipe@igarape.org', name : 'Felipe Amorim', isAdmin : true });

  user.hashPassword('1234', function() {
    user.save();
  })

  var expiration = moment().add('m', config.tokenDuration);
  db.AccessToken.create({
    scope : 'admin',
    expirationDate : expiration.toDate() 
  }).success(function(token) {
    token.setUser(user);

    var encodedToken = jwt.encode({
      iss : config.tokenIssuer,
      sub : token.id,
      exp : expiration.valueOf()
    }, config.tokenSecret);

    console.log(encodedToken);
  })
};
 
module.exports = lodash.extend({
  sequelize: sequelize,
  Sequelize: Sequelize
}, db);
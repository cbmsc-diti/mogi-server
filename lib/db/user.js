var pbkdf2 = require("easy-pbkdf2")();

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    id : {
      type : DataTypes.BIGINT,
      primaryKey : true,
      autoIncrement : true
    },
    username : {
      type : DataTypes.STRING,
      allowNull : false,
      unique : true
    },
    passwordHash : {
      type : DataTypes.STRING(1024),
      allowNull : false
    },
    passwordSalt : {
      type : DataTypes.STRING(1024),
      allowNull : false // 256 bytes base 64 encoded
    },
    name : {
      type : DataTypes.STRING,
      allowNull : false
    },
    email : {
      type : DataTypes.STRING(255),
      allowNull : false,
      unique : true,
      validate : {
        isEmail : true
      }
    },
    gcmRegistration : {
      type : DataTypes.STRING(1024),
      allowNull : true
    },
    isAdmin : {
      type : DataTypes.BOOLEAN,
      allowNull : false,
      defaultValue : false
    },
    lastLat : {
      type : DataTypes.FLOAT,
      allowNull : true
    },
    lastLng : {
      type : DataTypes.FLOAT,
      allowNull : true
    },
    lastLocationUpdateDate : {
      type : DataTypes.DATE,
      allowNull : true
    }
  }, {
    tableName: 'users',
    associate : function(models) {
      User.hasMany(models.AccessToken);
      User.hasMany(models.Location);
      User.hasMany(models.Video);
      User.belongsTo(models.Group);
    },
    instanceMethods : {
      validatePassword : function(password, done) {
        pbkdf2.verify(this.passwordSalt, this.passwordHash, password, function(err, valid) {
          return done(valid);
        });
      },
      hashPassword : function(password, done) {
        var self = this;
        pbkdf2.secureHash(password, function(err, passwordHash, newSalt) {
          self.passwordHash = passwordHash;
          self.passwordSalt = newSalt;
          done();
        });
      }
    }
  });

return User;
};

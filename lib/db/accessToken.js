var uuid = require('node-uuid');

module.exports = function(sequelize, DataTypes) {
  var AccessToken = sequelize.define('AccessToken', {
    id : {
        type : DataTypes.UUID,
        defaultValue : uuid.v4(),
        primaryKey : true
    },
    scope : {
      type : DataTypes.STRING(255),
        validate:{
            notNull : true,
            notEmpty: true
        }
    },
    expirationDate : {
      type : DataTypes.DATE,
        validate:{
            notNull : false,
            notEmpty: true
        }
    }
  }, {
    tableName: 'access_tokens',
    associate : function(models) {
      AccessToken.belongsTo(models.User);
    }
  });

  return AccessToken;
}
module.exports = function(sequelize, DataTypes) {
  var AccessToken = sequelize.define('AccessToken', {
    id : {
      type : DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey : true
    },
    scope : {
      type : DataTypes.STRING(255),
      allowNull : false
    },
    expirationDate : {
      type : DataTypes.DATE,
      allowNull : true
    }
  }, {
    tableName: 'access_tokens',
    associate : function(models) {
      AccessToken.belongsTo(models.User);
    }
  });

  return AccessToken;
}
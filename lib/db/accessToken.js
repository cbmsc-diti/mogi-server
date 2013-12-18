module.exports = function(sequelize, DataTypes) {
  var AccessToken = sequelize.define('AccessToken', {
    id : {
      type : DataTypes.UUID,
      defaultValue : DataTypes.UUIDV1,
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
    associate : function(models) {
      AccessToken.belongsTo(models.User);
    }
  });

  return AccessToken;
}
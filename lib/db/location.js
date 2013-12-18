module.exports = function(sequelize, DataTypes) {
  var Location = sequelize.define('Location', {
    date : {
      type : DataTypes.DATE,
      allowNull : false
    },
    lat : {
      type : DataTypes.FLOAT,
      allowNull : false
    },
    lng : {
      type : DataTypes.FLOAT,
      allowNull : false
    }
  }, {
    timestamps : false,
    associate : function(models) {
      Location.belongsTo(models.User);
    }
  });

  return Location;
}
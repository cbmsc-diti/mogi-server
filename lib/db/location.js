module.exports = function(sequelize, DataTypes) {
  var Location = sequelize.define('Location', {
    date : {
      type : DataTypes.DATE,
        validate:{
            notNull : true,
            notEmpty: true
        }
    },
    lat : {
      type : DataTypes.FLOAT,
        validate:{
            notNull : true,
            notEmpty: true
        }
    },
    lng : {
      type : DataTypes.FLOAT,
        validate:{
            notNull : true,
            notEmpty: true
        }
    }
  }, {
    tableName: 'locations',
    timestamps : false,
    associate : function(models) {
      Location.belongsTo(models.User);
    }
  });

  return Location;
}
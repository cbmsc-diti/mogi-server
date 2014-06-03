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
    },
    accuracy : {
        type : DataTypes.FLOAT
    },
    satellites : {
        type : DataTypes.INTEGER
    },
    provider : {
        type : DataTypes.STRING
    },
    bearing : {
        type : DataTypes.FLOAT
    },
    speed : {
        type : DataTypes.FLOAT
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
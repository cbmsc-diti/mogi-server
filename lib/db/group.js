module.exports = function(sequelize, DataTypes) {
  var Group = sequelize.define('Group', {
    id : {
      type : DataTypes.INTEGER,
      primaryKey : true,
      autoIncrement : true
    },
    name : {
      type : DataTypes.STRING(255),
      validate:{
        notNull : true
      },
      unique : true
    },
    isAdmin : {
        type : DataTypes.BOOLEAN
    },
    lat : {
          type : DataTypes.FLOAT
    },
    lng : {
          type : DataTypes.FLOAT
    }
  }, {
    tableName: 'groups',
    associate : function(models) {
      Group.hasMany(models.User);
    }
  });

  return Group;
};

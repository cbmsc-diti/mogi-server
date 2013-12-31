module.exports = function(sequelize, DataTypes) {
  var Video = sequelize.define('Video', {
    id : {
      type : DataTypes.UUID,
      defaultValue : DataTypes.UUIDV4,
      primaryKey : true
    },
    date : {
      type : DataTypes.DATE,
      allowNull : false
    },
    duration : {
      type : DataTypes.INTEGER,
      allowNull : false
    }
  }, {
    timestamps : false,
    associate : function(models) {
      Video.belongsTo(models.User);
    },
    instanceMethods : {
      filePath : function() {
        return this.UserId + '/' + this.id + '.mp4'; 
      }
    }
  });

  return Video;
}
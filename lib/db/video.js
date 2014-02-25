var uuid = require('node-uuid');

module.exports = function(sequelize, DataTypes) {
  var Video = sequelize.define('Video', {
    id : {
      type : DataTypes.UUID,
      defaultValue : uuid.v4(),
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
    tableName: 'videos',
    timestamps : false,
    associate : function(models) {
      Video.belongsTo(models.User);
    },
    instanceMethods : {
      filePath : function() {
        return this.userId + '/' + this.id + '.mp4';
      }
    }
  });

  return Video;
}
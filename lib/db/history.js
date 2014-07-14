module.exports = function(sequelize, DataTypes) {
    var Location = sequelize.define('History', {
        previousState : {
            type : DataTypes.STRING,
            validate:{
                notNull : true,
                notEmpty: true
            }
        },
        nextState : {
            type : DataTypes.STRING,
            validate:{
                notNull : true,
                notEmpty: true
            }
        }

    }, {
        tableName: 'histories',
        timestamps : true,
        associate : function(models) {
            Location.belongsTo(models.User);
        }
    });

    return Location;
}
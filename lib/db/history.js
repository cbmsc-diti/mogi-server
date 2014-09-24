module.exports = function(sequelize, DataTypes) {
    var History = sequelize.define('History', {
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
        },
        date: {
            type : DataTypes.DATE
        }

    }, {
        tableName: 'histories',
        timestamps : true,
        associate : function(models) {
            History.belongsTo(models.User);
        }
    });

    return History;
}
module.exports = {
    up: function(migration, DataTypes, done) {
        migration.addColumn("locations", "accuracy", DataTypes.FLOAT);
        migration.addColumn("locations", "satellites", DataTypes.INTEGER);
        migration.addColumn("locations", "provider", DataTypes.STRING);
        migration.addColumn("locations", "bearing", DataTypes.FLOAT);
        migration.addColumn("locations", "speed", DataTypes.FLOAT);
        done()
    },
    down: function(migration, DataTypes, done) {
        migration.removeColumn("locations", "accuracy", DataTypes.FLOAT);
        migration.removeColumn("locations", "satellites", DataTypes.INTEGER);
        migration.removeColumn("locations", "provider", DataTypes.STRING);
        migration.removeColumn("locations", "bearing", DataTypes.FLOAT);
        migration.removeColumn("locations", "speed", DataTypes.FLOAT);
        done()
    }
}
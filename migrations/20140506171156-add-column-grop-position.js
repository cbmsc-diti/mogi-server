module.exports = {
  up: function(migration, DataTypes, done) {
    migration.addColumn("groups", "lat", DataTypes.FLOAT);
    migration.addColumn("groups", "lng", DataTypes.FLOAT);
    done()
  },
  down: function(migration, DataTypes, done) {
    migration.removeColumn("groups", "lat", DataTypes.FLOAT);
    migration.removeColumn("groups", "lng", DataTypes.FLOAT);
    done()
  }
}

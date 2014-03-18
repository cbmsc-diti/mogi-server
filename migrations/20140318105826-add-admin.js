module.exports = {
  up: function(migration, DataTypes, done) {
    migration.addColumn("groups", "isAdmin", DataTypes.BOOLEAN);
    done()
  },
  down: function(migration, DataTypes, done) {
      migration.removeColumn("groups", "isAdmin");
    done()
  }
}

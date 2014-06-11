module.exports = {
  up: function(migration, DataTypes, done) {
      migration.addColumn("users", "profilePicture", DataTypes.STRING);
    done()
  },
  down: function(migration, DataTypes, done) {
      migration.removeColumn("users", "profilePicture", DataTypes.STRING);
    done()
  }
}

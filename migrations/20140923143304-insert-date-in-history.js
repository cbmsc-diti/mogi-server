module.exports = {
  up: function(migration, DataTypes, done) {
      migration.addColumn(
          'histories',
          'date',
          DataTypes.DATE
      ).success(function () {
              migration.migrator.sequelize.query("update histories as h set date = h.\"createdAt\"");
              done();
          });
  },
  down: function(migration, DataTypes, done) {
    migration.removeColumn('histories', 'date');
    done()
  }
}

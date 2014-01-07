var request = require('supertest'),
    should = require('should'),
    proxyquire =  require('proxyquire'),
    db = {},
    auth = require('./../mocks/auth'),
    users = proxyquire('./../../lib/users', { './../auth' : auth, './../db' : db }),
    api = request(users);

describe('Users Online Endpoint Tests', function() {

  beforeEach(function(done) {
    db.sequelize.sync({ force : true }).complete(done);
  });
  
  /*describe('When there is on online user', function() {
    it('should return 200 with json', function(done) {
      api.get('/me')
        .expect(200)
        .end(function(err, res) {
            res.body.username.should.equal(user.username);
            res.body.id.should.equal(user.id);
            done();
        });
    });
  });*/
});
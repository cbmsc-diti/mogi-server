var request = require('supertest'),
    should = require('should'),
    proxyquire =  require('proxyquire').noCallThru(),
    db = {},
    auth = require('./../mocks/auth'),
    users = proxyquire('./../../lib/users', { './../auth' : auth, './../db' : db });

request = request(users);

describe('Users Me Endpoint Tests', function() {

  describe('When token is valid', function() {
    var user = { id : 1, username : "test" };

    beforeEach(function() {
      auth.user = user;
      auth.scope = 'client';
    });

    it('should return 200 with json', function(done) {
      request.get('/me')
        .expect(200)
        .end(function(err, res) {
            res.body.username.should.equal(user.username);
            res.body.id.should.equal(user.id);
            done();
        });
    });

  });
});
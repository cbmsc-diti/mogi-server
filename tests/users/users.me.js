var request = require('supertest'),
    should = require('should'),
    proxyquire =  require('proxyquire'),
    db = {},
    auth = {},
    users = proxyquire('./../../lib/users', { './../auth' : auth, './../db' : db });

request = request(users);

//FIXME: Proxyquire isn't working. Going to have to skip testing.

describe('Users Me Endpoint Tests', function() {

  describe('When token is valid', function() {
    var user = { user_id : 1, username : "test" };

    beforeEach(function() {
      auth.ensureToken = function(req, res, next) {
        req.user = user;
        req.authInfo = { scope : 'client' };
        next();
      }
    })

    it('should return 200 with json', function(done) {
      request.get('/me')
        .expect(JSON.stringify({ user_id : 1, username : "test", scope : "client" }))
        .expect(200, done);
    })

  });
});
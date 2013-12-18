var express = require('express'),
    app = module.exports = express(),
    moment = require('moment'),
    db = require('./../db'),
    auth = require('./../auth');

app.get('/me', auth.ensureToken, function (req, res) {
  res.json({ user_id: req.user.id, name: req.user.username, scope: req.authInfo.scope })
});

app.get('/users', auth.ensureAdmin, function (req, res) {
  var where = [''], 
      page = req.query.page || 0, 
      pageSize = req.query.pageSize || 25;
  
  if ( req.query.text ) {
    where[0] += "(username LIKE ? OR name LIKE ?)";
    where[1] = req.query.text; 
    where[2] = req.query.text;
  }

  if ( req.query.date ) {
    var date = moment(req.query.date),
        params = [date.hour(0).minute(0).second(0), date.hour(23).minute(59).second(59)]
        query = 'SELECT U.id, U.username, U.name FROM "Users" U INNER JOIN "AccessTokens" A ON U.id = A."UserId"'

    query += ' WHERE A."createdAt" BETWEEN(?,?)';

    if ( req.query.text ) {
      query += ' AND (U.username LIKE ? OR U.name LIKE ?)';
      params.push(req.query.text);
      params.push(req.query.text);
    }

    db.sequelize.query(query, params, { raw : true }).success(function(result) {
      res.send(result);
    });

  } else {
    db.User.findAndCountAll({ where : where, offset : page, limit : pageSize, attribute : ['username','name','id'] }).success(function(result) {
      res.send(result);
    });  
  }
});

app.post('/users', auth.ensureAdmin, function (req, res) {
  var user = db.User.build({
    username : req.body.username,
    email : req.body.email,
    name : req.body.name,
    isAdmin : req.body.isAdmin
  });

  user.hashPassword(req.body.password, function() {
    user.save().success(function() {
      res.send(202);
    }).error(function(err) {
      res.send(500, err);
    });
  });
});
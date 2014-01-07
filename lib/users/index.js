var express = require('express'),
    app = module.exports = express(),
    moment = require('moment'),
    db = require('./../db'),
    auth = require('./../auth');

app.get('/me', auth.ensureToken, function (req, res) {
  res.json({ id : req.user.id, username: req.user.username, scope: req.authInfo.scope });
});

app.get('/users/online', auth.ensureAdmin, function(req,res) {
  var date = moment().set('m', -10);

  db.User.findAll({ where : { lastLat : { ne : null }, lastLocationUpdateDate : { gte : date.toDate() }}, attributes : ['id','username']})
    .success(function (users) {
      res.send(users);
    }).error(function (err) {
      console.log(err);
      res.send(500);
    });
});

app.get('/users', auth.ensureAdmin, function (req, res) {
  var where = [''], 
      page = req.query.page || 0, 
      pageSize = req.query.pageSize || 25;

  if ( req.query.user ) {
    req.query.user = '%' + req.query.user + '%';
  }

  if ( req.query.date ) {
    var date = moment(req.query.date),
        params = [date.toDate()];
        query = 'SELECT DISTINCT U.id, U.username, U.name FROM "Users" U INNER JOIN "AccessTokens" A ON U.id = A."UserId"';

    query += " WHERE date_trunc('day', A.\"createdAt\") = ?::date";

    if ( req.query.user ) {
      query += ' AND (U.username LIKE ? OR U.name LIKE ?)';
      params.push(req.query.user);
      params.push(req.query.user);
    }

    console.log(query, params);

    db.sequelize.query(query, null, { logging : console.log, raw : true }, params).success(function(result) {
      res.send(result);
    });

  } else {
    if ( req.query.user ) {
      where[0] += "(username LIKE ? OR name LIKE ?)";
      where[1] = req.query.user; 
      where[2] = req.query.user;
    }
    db.User.findAndCountAll({ where : where, offset : page, limit : pageSize, attributes : ['username','name','id'] }).success(function(result) {
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
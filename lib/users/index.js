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

  db.User.findAll({ where : { lastLat : { ne : null }, lastLocationUpdateDate : { gte : date.toDate() }},
      attributes : ['id','username', 'lastLat', 'lastLng']})
    .success(function (users) {
      res.send(users.map(function(user) {
          return {
              id : user.id,
              username: user.username,
              lat: user.lastLat,
              lng: user.lastLng
          }
      }));
    }).error(function (err) {
      console.log(err);
      res.send(500);
    });
});

app.get('/users', auth.ensureAdmin, function (req, res) {
  var where = [],
      params = [],
      page = req.query.page || 0,
      pageSize = req.query.pageSize || 25,
      select = ['SELECT DISTINCT U.id, U.username, U.name, G.name as group FROM "Users" U LEFT OUTER JOIN "Groups" G ON U."GroupId" = G.id'];

  if ( req.query.user ) {
    req.query.user = '%' + req.query.user + '%';
    where.push('(U.username LIKE ? OR U.name LIKE ?)');
    params.push(req.query.user);
    params.push(req.query.user);
  }

  if ( req.query.date ) {
    var date = moment(req.query.date);

    select.push('INNER JOIN "AccessTokens" A ON U.id = A."UserId"');
    where.push("date_trunc('day', A.\"createdAt\") = ?::date AND A.scope = 'client'");
    params.push(date.toDate());
  }

  if ( req.query.group ) {
    where.push('G.name LIKE ?');
    params.push('%' + req.query.group + '%');
  }

  var query = select.join(' ') + ((where.length > 0) ? ' WHERE ' + where.join(' AND ') : '');

  db.sequelize.query(query, null, { logging : console.log, raw : true }, params).success(function(result) {
    res.send(result);
  });
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

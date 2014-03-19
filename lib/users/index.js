var express = require('express'),
    app = module.exports = express(),
    moment = require('moment'),
    db = require('./../db'),
    auth = require('./../auth');

app.get('/me', auth.ensureToken, function (req, res) {
  res.json({
      id : req.user.id,
      username: req.user.username,
      group: req.user.getGroup() != null ? req.user.getGroup().name  : null,
      scope: req.authInfo.scope });
});

app.get('/users/online', auth.ensureAdmin, function(req,res) {
  var date = moment().set('m', -10), where;

  db.Group.find(req.user.groupId).success(function(group){
      if (group == null ||  group.isAdmin === true){
          where = { lastLat : { ne : null }, lastLocationUpdateDate : { gte : date.toDate() }};
      } else {
          where = { lastLat : { ne : null }, lastLocationUpdateDate : { gte : date.toDate() }, groupId: req.user.groupId};
      }
      db.User.findAll({ where : where,
          attributes : ['id','name', 'lastLat', 'lastLng']})
        .success(function (users) {
          res.send(users.map(function(user) {
              return {
                  id : user.id,
                  name: user.name,
                  lat: user.lastLat,
                  lng: user.lastLng,
                  group: user.getGroup() != null ? user.getGroup().name  : null
              }
          }));
        }).error(function (err) {
          console.log(err);
          res.send(500);
        });
  });
});

app.get('/users', auth.ensureAdmin, function (req, res) {
  db.Group.find(req.user.groupId).success(function(group){
      var where = [],
          params = [],
          page = req.query.page || 0,
          pageSize = req.query.pageSize || 25,
          select = ['SELECT DISTINCT U.id, U.username, U.name, G.name as group FROM "users" U LEFT OUTER JOIN "groups" G ON U."groupId" = G.id'];

      if ( req.query.user ) {
        req.query.user = '%' + req.query.user + '%';
        where.push('(U.username LIKE ? OR U.name LIKE ?)');
        params.push(req.query.user);
        params.push(req.query.user);
      }

      if ( req.query.date ) {
        var date = moment(req.query.date);

        select.push('INNER JOIN "access_tokens" A ON U.id = A."userId"');
        where.push("date_trunc('day', A.\"createdAt\") = ?::date AND A.scope = 'client'");
        params.push(date.toDate());
      }


      if (group == null || group.isAdmin === true){
          if (req.query.group ) {
              where.push('G.name LIKE ?');
              params.push('%' + req.query.group + '%');
          }
      } else {
          where.push('G.id = ?');
          params.push(group.id);
      }

      var query = select.join(' ') + ((where.length > 0) ? ' WHERE ' + where.join(' AND ') : '');

      db.sequelize.query(query, null, { logging : console.log, raw : true }, params).success(function(result) {
        res.send(result);
      });
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
      res.send(422, err);
    });
  });
});

app.post('/users/:id', auth.ensureAdmin, function(req,res) {
    db.Group.find(req.user.groupId).success(function(group){

        db.User.find(req.params.id).success(function(user) {
            if (group != null && group.isAdmin !== true && group.id != user.groupId){
                res.send(403);
            } else {
                user.updateAttributes(req.body).success(function(){
                    res.send(user);
                }).error(function(err) {
                    res.send(422, err);
                });
            }
        }).error(function(err) {
            res.send(500, err);
        });
    });
});

app.get('/users/:id', auth.ensureAdmin, function(req,res) {
    db.Group.find(req.user.groupId).success(function(group){
        db.User.find(req.params.id).success(function(user) {
            if (group != null && group.isAdmin !== true && group.id != user.groupId){
                res.send(403);
            } else {
                res.send(user);
            }
        }).error(function(err) {
           res.send(500, err);
        });
    });
});

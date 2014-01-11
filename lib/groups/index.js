var express = require('express'),
    app = module.exports = express(),
    moment = require('moment'),
    db = require('./../db'),
    auth = require('./../auth');

app.get('/groups', auth.ensureAdmin, function(req, res) {
	db.Group.findAll({ order : 'name ASC', attributes : ['id','name']}).success(function(groups){
    res.send(groups);
  });
});

app.post('/groups', auth.ensureAdmin, function(req, res) {
  db.Group
    .build({ name : req.body.name })
    .save()
    .success(function(group) {
      res.send(200, { id : group.id });
    }).error(function(err) {
      res.send(500, err);
    });
});

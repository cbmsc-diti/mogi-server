var express = require('express'),
    app = module.exports = express(),
    db = require('./../db'),
    _ = require('lodash'),
    fs = require('fs'),
    auth = require('./../auth');

app.get('/users/locations', auth.ensureAdmin, function(req,res) {
  var date = moment().set('m', 30);

  db.User.findAll({ where : ["lastLat != ? AND lastLocationUpdateDate >= ?", null, date.toDate() ], attributes : ['id','username']})
    .success(function (users) {
      res.send(users);
    }).error(function (err) {
      console.log(err);
      res.send(500);
    });
});

app.get('/users/:id/locations/:date', auth.ensureAdmin, function(req,res) {
  var dateRange = [ moment(req.params.date), moment(req.params.date).hour(23).minute(59).seconds(59) ];

  db.Location.findAll({ where : { date : { between : dateRange }, UserId : req.params.id } },{ raw : true })
    .success(function(locations) {
      res.send(locations);
    }).error(function(err) {
      console.log(err);
      res.send(500);
    })
});

app.post('/me/locations', auth.ensureToken, function(req,res) {
  if ( !(req.body instanceof Array) ) {
    req.body = [req.body];
    req.user.lastLat = req.body.lat;
    req.user.lastLng = req.body.lng;
    req.user.lastLocationUpdateDate = new Date();
    req.user.save();
  } 

  _.forEach(req.body, function(loc) {
    loc.UserId = req.user.id;
  });

  db.Location.bulkCreate(req.body)
    .success(function(result) {
      res.send(200);
    }).error(function(err) {
      console.log(err);
      res.send(500);
    });
});
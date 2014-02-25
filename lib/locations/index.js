var express = require('express'),
    app = module.exports = express(),
    moment = require('moment'),
    db = require('./../db'),
    _ = require('lodash'),
    fs = require('fs'),
    io = require('socket.io'),
    auth = require('./../auth');

app.post('/locations', auth.ensureToken, function(req,res) {
  if ( !(req.body instanceof Array) ) {
    req.user.lastLat = req.body.lat;
    req.user.lastLng = req.body.lng;
    req.user.lastLocationUpdateDate = req.body.date = new Date();
    req.user.save();
    app.get('sockets').emit('users:location', { id : req.user.id, lat: req.body.lat, lng: req.body.lng });
    req.body = [req.body];
  }

  _.forEach(req.body, function(loc) {
    loc.userId = req.user.id;
  });

  db.Location.bulkCreate(req.body)
    .success(function(result) {
      res.send(200);
    }).error(function(err) {
      console.log(err);
      res.send(500);
    });
});

app.get('/users/:id/locations/:date', auth.ensureAdmin, function(req,res) {
  var dateRange = [ moment(req.params.date).toDate(), moment(req.params.date).hour(23).minute(59).seconds(59).toDate() ];

  db.Location.findAll({ where : { date : { between : dateRange }, userId : req.params.id }, attributes : ['lat','lng','date'] },{ raw : true })
    .success(function(locations) {
      res.send(locations);
    }).error(function(err) {
      console.log(err);
      res.send(500);
    });
});

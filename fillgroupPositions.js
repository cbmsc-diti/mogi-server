var express = require('express'),
    app = module.exports = express(),
    db = require('./lib/db'),
    auth = require('./lib/auth');

db.Group.find({ where: {name: 'Instituto Igarapé'} }).success(function(group) {
    group.lat = -22.909639
    group.lng = -43.205776
    group.save();
})

db.Group.find({ where: {name: 'Cape Town'} }).success(function(group) {
    if(group){
        group.lat = -33.920684
        group.lng = 18.425690
        group.save();
    }
})

db.Group.find({ where: {name: 'Google'} }).success(function(group) {
    if(group){
        group.lat = 40.741059
        group.lng = -74.003081
        group.save();
    }
})

db.Group.find({ where: {name: 'Nairobi'} }).success(function(group) {
    if(group){
        group.lat = -1.292151
        group.lng = 36.821967
        group.save();
    }
})

db.Group.find({ where: {name: 'Rocinha'} }).success(function(group) {
    if(group){
        group.lat = -22.988561
        group.lng = -43.246453
        group.save();
    }
})

db.Group.find({ where: {name: 'UPP Santa Marta'} }).success(function(group) {
    if(group){
        group.lat = -22.948079
        group.lng = -43.193626
        group.save();
    }
})
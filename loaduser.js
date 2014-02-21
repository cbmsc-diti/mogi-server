var express = require('express'),
    app = module.exports = express(),
    moment = require('moment'),
    db = require('./lib/db'),
    auth = require('./lib/auth');
//
//var user = db.User.build({
//    username : "bsiqueira",
//    email : "bsiqueira@gmail.com",
//    name : "Bruno Siqueira",
//    isAdmin : true
//});
//
//user.hashPassword("bsiqueira", function() {
//    user.save();
//});

var group = db.Group.build({name: "Rocinha"});
db.Group.find({name: "Rocinha"}).complete(function(err, group){
    db.User.find({username: "bsiqueira"}).complete(function(err, user2){
        user2.setGroup(group);
        user2.save();
    });
});
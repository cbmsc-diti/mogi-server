var express = require('express'),
    app = module.exports = express(),
    moment = require('moment'),
    db = require('./lib/db'),
    auth = require('./lib/auth');

var user = db.User.build({
    username : "bsiqueira",
    email : "bsiqueira@gmail.com",
    name : "Bruno Siqueira",
    isAdmin : true
});

user.hashPassword("bsiqueira", function() {
    user.save().complete(function(err, u){
        var group = db.Group.build({name: "Rocinha"});
        group.save().complete(function(err, group){

                u.setGroup(group);
                u.save();

        });
    });
});


var username = "vladeira";
var password = "vladeira";
var email = "vladeira@gmail.com";
var name = "Victor Ladeira";

var express = require('express'),
    app = module.exports = express(),
    db = require('./lib/db'),
    auth = require('./lib/auth');

var user = db.User.build({
    username : username,
    email : email,
    name : name,
    isAdmin : true
});

user.hashPassword(password, function() {
    user.save().complete(function(){
        var group = db.Group.find({name: "Rocinha"}).complete(function(group){
            if (group == null){
                group = db.Group.build({name: "Rocinha"});
                group.save().complete(function(err, group){
                    user.setGroup(group);
                    user.save();
                });
            } else {
                user.setGroup(group);
                user.save();
            }
        })


    });
});


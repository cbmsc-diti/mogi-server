var groupName = "Instituto Igarapé", admin = true;

var express = require('express'),
    app = module.exports = express(),
    db = require('./lib/db'),
    auth = require('./lib/auth');


group = db.Group.build({name: groupName, isAdmin: admin});
group.save();


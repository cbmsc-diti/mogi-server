var express = require('express'),
    app = module.exports = express(),
    config = require('./../config'),
    fs = require('fs'),
    db = require('./../db'),
    auth = require('./../auth');

app.get('/config', function(req, res) {
  if ( config.configured ) {
    return res.send(400, { message : "Server already configured"});
  }
  res.sendfile(__dirname + '/views/wizard.html');
});

app.post('/config', function(req, res) {
  if ( config.configured ) {
    return res.send(400, { message : "Server already configured" });
  }

  var admin = db.User.build({
    username : req.body.adminUsername,
    name : req.body.adminName,
    email : req.body.adminEmail,
    isAdmin : true
  });

  admin.hashPassword(req.body.adminPassword, function() {
    admin.save()
      .success(function() {

        // get the config file of the current environment
        var envJson = __dirname + '/env/' + process.env.NODE_ENV + '.json';
        console.log(envJson);
        fs.readFile(envJson, function(err, data) {
          if ( err ) return res.send(500, { message : "Could not load configuration file"});

          data = JSON.parse(data);
          data.configured = true;
          fs.writeFile(envJson, JSON.stringify(data, null, 2), function(err) {
            if ( err ) return res.send(500, { message : "Could not save configurations" });
            config.configured = true;
            res.send(200);
          });
        });
      })
      .error(function(err) {
        res.send(500, { message : "Could not save admin user", error : err });
      });
  });
});

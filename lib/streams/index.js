var express = require('express'),
    app = module.exports = express(),
    db = require('./../db'),
    fs = require('fs'),
    config = require('./../config'),
    gcm = new require('node-gcm'),
    sender = new gcm.Sender(config.googleApiKey),
    auth = require('./../auth'),
    os = require('os');

app.post('/streams/:userId/start', auth.ensureAdmin, function (req, res) {
   db.User.find(req.params.userId).success(function (user) {
       sender.send(new gcm.Message({ collapseKey : "startStreaming"}), [user.gcmRegistration], 4, function(err, result) {
           if ( err || !result ) {
               res.send(500, { message : 'Unable to request streaming' });
           }
           var interfaces = os.networkInterfaces();
           var en1 = interfaces["en1"];
           var address = null;
           for (a in en1) {
               if (en1[a].family === 'IPv4' && !en1[a].internal) {
                   address = en1[a].address;
               }
           }
           res.send(200, {
               message : 'Stream requested.',
               streamUrl: "rtmp://"+address+":"+config.wowza.port+config.wowza.path+req.user.id+".stream"
           });
       });
   });
});

app.post('/streams/:userId/stop', auth.ensureAdmin, function (req, res) {
    db.User.find(req.params.userId).success(function (user) {
        sender.send(new gcm.Message({ collapseKey : "stopStreaming"}), [user.gcmRegistration], 4, function(err, result) {
            if ( err || !result ) {
                res.send(500, { message : 'Unable to request streaming' });
            }

            res.send(200, { message : 'Stream finished.'});
        });
    });
});

app.get('/streams/:userId', auth.ensureAdmin, function(req,res) {
  var stream = fs.createReadStream('./streams/' + req.params.userId);

  stream.on('error', function() {
    res.send(500);
  });

  stream.pipe(res);
});

app.post('/streams', auth.ensureToken, function(req,res) {
    res.send(200, {
        message: "Stream sent"
    });
    app.get('sockets').emit('streaming:start', { id : req.user.id });
});

app.del('/streams', auth.ensureToken, function(req,res) {
  res.send(200);
  app.get('sockets').emit('streaming:stop', { id : req.user.id });
});

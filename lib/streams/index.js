var express = require('express'),
    app = module.exports = express(),
    db = require('./../db'),
    fs = require('fs'),
    io = require('socket.io'),
    _ = require('lodash'),
    config = require('./../config'),
    gcm = new require('node-gcm'),
    sender = new gcm.Sender(config.googleApiKey),
    auth = require('./../auth');

app.get('/streams', auth.ensureAdmin, function(req,res) {
  fs.readdir('./streams/', function(err, files) {
    if ( err ) return res.send(500, err);
    res.send(_.map(files, function(file) { return file.replace('.sdp',''); }));
  });
});

app.get('/streams/:userId/start', auth.ensureAdmin, function (req, res) {
   db.User.find(req.params.userId).success(function (user) {
       sender.send(new gcm.Message({ collapseKey : "startStreaming"}, [user.gcmRegistration], 4, function(err, result) {
           if ( err || !result ) {
               res.send(500, { message : 'Unable to request streaming' });
           }

           res.send(200, { message : 'Stream requested.'});
       }));
   });
});


app.get('/streams/:userId/stop', auth.ensureAdmin, function (req, res) {
    db.User.find(req.params.userId).success(function (user) {
        sender.send(new gcm.Message({ collapseKey : "stopStreaming"}, [user.gcmRegistration], 4, function(err, result) {
            if ( err || !result ) {
                res.send(500, { message : 'Unable to request streaming' });
            }

            res.send(200, { message : 'Stream requested.'});
        }));
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
  var sdp = req.body.sdp;

  var sdpFile = './streams/' + req.user.id + '.sdp';
  fs.writeFile(sdpFile, sdp, function(err) {
    if (err) {
      console.log("[ERRO] Unable to save streaming session.");
      return res.send(500, err);
    }

    app.get('sockets').emit('streaming:start', { id : req.user.id });

    res.send(200);
  });
});

app.del('/streams', auth.ensureToken, function(req,res) {
  var sdpFile = './streams/' + req.user.id + '.sdp';
  fs.unlink(sdpFile);
  res.send(200);
  app.get('sockets').emit('streaming:stop', { id : req.user.id });
});

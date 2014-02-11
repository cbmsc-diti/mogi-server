var express = require('express'),
    app = module.exports = express(),
    db = require('./../db'),
    fs = require('fs'),
    io = require('socket.io'),
    _ = require('lodash'),
    auth = require('./../auth');

app.get('/streams', auth.ensureAdmin, function(req,res) {
  fs.readdir('./streams/', function(err, files) {
    if ( err ) return res.send(500, err);
    res.send(_.map(files, function(file) { return file.replace('.sdp',''); }));
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

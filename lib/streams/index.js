var express = require('express'),
    app = module.exports = express(),
    db = require('./../db'),
    fs = require('fs'),
    auth = require('./../auth');

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
      return res.send(500, { error: err });
    }

    res.send(200);
  });
});

app.del('/streams', auth.ensureToken, function(req,res) {
  var sdpFile = './streams/' + req.user.id + '.sdp';
  fs.unlink(sdpFile);
  res.send(200);
});
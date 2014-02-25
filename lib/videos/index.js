var express = require('express'),
    app = module.exports = express(),
    db = require('./../db'),
    auth = require('./../auth'),
    fs = require('fs'),
    config = require('./../config'),
    storage = require('./storage'),
    formidable = require('formidable'),
    ffmpeg = require('fluent-ffmpeg'),
    Metalib = require('fluent-ffmpeg').Metadata,
    tmp = require('temporary'),
    moment = require('moment');

app.get('/users/:id/videos/from/:date', auth.ensureAdmin, function (req, res) {
  var dateRange = [ moment(req.params.date).toDate(), moment(req.params.date).hour(23).minute(59).seconds(59).toDate() ];
  db.Video.findAll({ where : { date : { between : dateRange }, userId : req.params.id }},{ raw : true })
    .success(function(videos) {
      var result = [];
      videos.forEach(function(video) {
        result.push({
          id : video.id,
          from : moment(video.date).toISOString(),
          to : moment(video.date).add('seconds', video.duration).toISOString()
        });
      });

      res.send(result);
    });
});

app.get('/users/:id/videos/:video', auth.ensureAdmin, function (req, res) {
  db.Video.find(req.params.video).success(function(video) {
    if (!video) return res.send(404);

    storage.readVideoStream(video, function(err, stream) {
      if ( err ) return res.send(500);

      stream.pipe(res);
      stream.on('error', function() {
        res.send(500);
      });
    });
  });
});

app.post('/videos', auth.ensureToken, function (req, res) {
  var form = new formidable.IncomingForm();

  form.parse(req, function(err, fields, files) {
    if ( err ) {
      return res.send(500, { message : 'Could not upload video.', error : err });
    }

    var videoFile = files.video;
    //var audioFile = files.audio;
    var dateRecorded = moment(fields.date);

    // get metadata. this is good check to see if the video is valid
    new Metalib(videoFile.path, function(metadata, err) {
      if ( err ) return res.send(500, { message : 'Invalid video'});


      db.Video.create({ date : dateRecorded.toISOString(), duration : metadata.durationsec })
        .success(function(video) {
          video.setUser(req.user);
          storage.createVideoStream(video, function(streamError, storageStream) {
            if ( streamError ) {
              console.log('STREAMERR:', streamError);
              return res.send(500, { message : 'Unable to store video' });
            }

            fs.createReadStream(videoFile.path).pipe(storageStream);

            storageStream.on('close', function() {
              res.send(201);
            });

            storageStream.on('error', function() {
              res.send(500, { message : 'Unable to store video' });
            });
          });
        });
    });
  });
});

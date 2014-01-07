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
    moment = require('moment');

app.get('/users/:id/videos/from/:date', auth.ensureAdmin, function (req, res) {
  var dateRange = [ moment(req.params.date), moment(req.params.date).hour(23).minute(59).seconds(59) ];
  db.Video.findAll({ where : { date : { between : dateRange }, UserId : req.params.id }, attributes : ['id'] },{ raw : true })
    .success(function(videos) {
      res.send(videos);
    });
});

app.get('/users/:id/videos/:video', auth.ensureAdmin, function (req, res) {
  db.Video.find(req.params.video).success(function(video) {
    if (!video) return res.send(404);

    var videoFile = storage.open(video);

    videoFile.pipe(res);

    videoFile.on('error', function() {
      res.send(500);
    });
  })
});

app.post('/me/videos', auth.ensureToken, function (req, res) {
   var form = new formidable.IncomingForm();

  form.parse(req, function(err, fields, files) {
    if ( err ) {
      return res.send(500, { message : 'Could not upload video.', error : err });
    }

    var videoFile = files.video;
    var audioFile = files.audio;
    var dateRecorded = moment(fields.dateBegin);

    // get metadata. this is good check to see if the video is valid
    new Metalib(videoFile.path, function(metadata, err) {
      if ( err ) return res.send(500, { message : 'Invalid video'});

      db.Video.create({ data : dateRecorded.toDate(), duration : metadata.durationsec })
        .success(function(video) {
          video.setUser(req.user);

          var videoProcessing = new ffmpeg({ source : videoFile.path, timeout : 120 })
            .addInput(audioFile.path)
            .withVideoCodec("copy")
            .withAudioCodec("copy")
            .saveToFile(video.filePath(), function(retcode, encodeError) {
              if ( encodeError ) {
                console.log(encodeError);
                video.destroy();
                return res.send(500, { message : 'Could not upload video.'});
              }

              storage.save(file, video, function (saveError, done) {
                if ( saveError ) {
                  console.log(saveError);
                  video.destroy();
                  return res.send(500, { message : 'Could not upload video.'});
                }

                res.send(200);
              });
            });
        });
    });
  }); 
});
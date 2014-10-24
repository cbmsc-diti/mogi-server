var path = require('path'),
    fs = require('node-fs'),
    FFmpeg = require('fluent-ffmpeg');

var basePath = path.resolve(__dirname, '../../../videos') + '/';
exports.createVideoStream = function(sourcePath, video, metadata, callback) {
  var finalPath = basePath + video.filePath();

  fs.mkdir(path.dirname(finalPath), 0777, true, function(err) {
    if ( err ) return callback(error, null);
      var ffmpeg = new FFmpeg({ source: sourcePath });
      console.log("source path:" + sourcePath);
      if (metadata.video.rotate != undefined && metadata.video.rotate == 90) {
          ffmpeg = ffmpeg.withVideoFilter("transpose=1")
      }
      ffmpeg.on('error', function(err, stdout, stderr) {
          console.log("ffmpeg stdout:\n" + stdout);
          console.log("ffmpeg stderr:\n" + stderr);

          console.log('Cannot process video: ' + err.message);
          callback(err);
      }).on('end', function() {
          // The 'end' event is emitted when FFmpeg finishes
          // processing.
          console.log('Processing finished successfully');
          callback(null);
      }).saveToFile(finalPath);
  });
};


exports.readVideoStream = function(video, callback, options) {
  callback(null, fs.createReadStream(basePath + video.filePath(),options));
};

exports.getTotalSize = function(video){
    return fs.statSync(basePath + video.filePath()).size;
};

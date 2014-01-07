var config = require('./../../config');

exports.save = function(videoFile, video, callback) {
  fs.rename(file.path, config.videoPath + video.filePath(), function(error) {
    if ( error ) return callback(error, null);
    callback(null, true);
  });
};


exports.open = function(video) {
  return fs.createReadStream(config.videoPath + video.filePath());
};
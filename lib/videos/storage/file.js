var config = require('./../../config');

exports.save = function(videoFile, video, callback) {
  fs.rename(file.path, config.videoPath + video.filePath(), function(error) {
    if ( error ) return callback(error, null);
    callback(null, true);
  });
};

exports.delete = function(video) {

};
var path = require('path'),
    fs = require('node-fs');

var basePath = path.resolve(__dirname, '../../../videos') + '/';
exports.createVideoStream = function(video, callback) {
  var finalPath = basePath + video.filePath();

  fs.mkdir(path.dirname(finalPath), 0777, true, function(err) {
    if ( err ) return callback(error, null);

    callback(null, fs.createWriteStream(finalPath));
  });
};


exports.readVideoStream = function(video, callback) {
  callback(null, fs.createReadStream(basePath + video.filePath()));
};

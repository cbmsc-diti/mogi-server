var path = require('path'),
    fs = require('node-fs');

var basePath = path.resolve(__dirname, '../../../streams') + '/';
exports.createFileStream = function(fileName, callback) {
  var finalPath = basePath + fileName;

  fs.mkdir(path.dirname(finalPath), 0777, true, function(err) {
    if ( err ) return callback(error, null);

    callback(null, fs.createWriteStream(finalPath));
  });
};


exports.readFileStream = function(fileName, callback, options) {
  callback(null, fs.createReadStream(basePath + fileName,options));
};

exports.deleteFileStream = function(fileName){
    fs.unlink(basePath + fileName);
}

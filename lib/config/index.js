var lodash = require('lodash');

module.exports = lodash.extend(
    require(__dirname + '/../config/env/all.js'),
    require(__dirname + '/../config/env/' + process.env.NODE_ENV + '.js') || {});
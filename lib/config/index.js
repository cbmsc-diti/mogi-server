var lodash = require('lodash');

module.exports = lodash.extend(
    require(__dirname + '/../config/env/all.json'),
    require(__dirname + '/../config/env/' + process.env.NODE_ENV + '.json') || {});

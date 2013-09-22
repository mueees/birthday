var nconf = require("nconf");
var path = require("path");

nconf.argv()
    .env()
    .file({ file:  path.join(__dirname, 'main.json') });

module.exports = nconf;
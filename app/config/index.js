var nconf = require("nconf");
var path = require("path");
var configFile;

var env = process.env.NODE_ENV;

if((env == 'development')){
    configFile = 'development.json'
}else if(env == 'live'){
    configFile = 'live.json'
}else if(env == 'batros'){
    configFile = 'batros.json'
}

nconf.argv().env();

nconf.file('secret', {file: path.join(__dirname, 'secret.json')});
nconf.file('configFile', {file: path.join(__dirname, configFile)});

module.exports = nconf;
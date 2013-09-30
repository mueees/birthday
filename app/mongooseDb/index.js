var mongoose = require('mongoose'),
    config = require('config');

console.log(mongoose);
mongoose.connect('mongodb://' + config.get('db:ip') + '/' + config.get('db:nameDatabase') +':'+ config.get('db:port'));
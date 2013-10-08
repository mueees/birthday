var _ = require('underscore'),
    BaseModel = require('../_base/model'),
    util = require('util'),
    mongoose = require('mongoose');

var Schema = mongoose.Schema;
var streamSchema = new Schema({
        name: String,
        track: String,
        language: []
    });

var StreamModel = mongoose.model('Stream', streamSchema);


module.exports = StreamModel;
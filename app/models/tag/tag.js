var _ = require('underscore'),
    util = require('util'),
    logger = require("libs/log")(module),
    $ = require('jquery'),
    jsdom = require("jsdom").jsdom,
    mongoose = require('mongoose');

var Schema = mongoose.Schema;
var tagSchema = new Schema({
    name: String
});

var Tag = mongoose.model('tag', tagSchema);

module.exports = Tag;
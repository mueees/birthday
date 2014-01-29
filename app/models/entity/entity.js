var _ = require('underscore'),
    util = require('util'),
    logger = require("libs/log")(module),
    $ = require('jquery'),
    jsdom = require("jsdom").jsdom,
    mongoose = require('mongoose');

var Schema = mongoose.Schema;
var entitySchema = new Schema({
    title: String,
    body: String,
    linkToOriginal: String,
    tags: [],
    dateCreate: Date,
    isRead: {
        type: Boolean,
        default: false
    },
    important: {
        type: Number,
        default: 1
    }
});

var Entity = mongoose.model('entity', entitySchema);
module.exports = Entity;
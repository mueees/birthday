var _ = require('underscore'),
    util = require('util'),
    logger = require("libs/log")(module),
    $ = require('jquery'),
    jsdom = require("jsdom").jsdom,
    mongoose = require('mongoose');

var Schema = mongoose.Schema;
var docSchema = new Schema({
    title: String,
    body: String,
    linkToOriginal: String,
    tags: [],
    dateCreate: {
        type: Date,
        default: new Date()
    },
    isRead: {
        type: Boolean,
        default: false
    },
    important: {
        type: Number,
        default: 1
    }
});

var Doc = mongoose.model('doc', docSchema);

Doc.schema.path('title').validate(function (value, respond) {
    if(!value || value.length == 0){
        respond(false);    
    }else{
        respond(true);   
    }                                                                                                                                         
}, 'The title is required');

Doc.schema.path('body').validate(function (value, respond) {
    if(!value || value.length == 0){
        respond(false);    
    }else{
        respond(true);   
    }                                                                                                                                         
}, 'The body is required');

module.exports = Doc;
var _ = require('underscore'),
    logger = require("libs/log")(module),
    mongoose = require('mongoose');

var Schema = mongoose.Schema;

var Member = new Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true      
    },
    group: {
        type: String,
        default: "guest",
        required: true
    }
});

var MemberModel = mongoose.model('Member', Member);
module.exports = MemberModel;
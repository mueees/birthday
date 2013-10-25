var _ = require('underscore'),
    util = require('util'),
    logger = require("libs/log")(module),
    mongoose = require('mongoose');

var Schema = mongoose.Schema;
var postSchema = new Schema({
    title: String,
    description: String,
    summary: String,
    link: String,
    date: String,
    pubdate: String,
    guid: String,
    image: String,
    source: String
});


postSchema.methods.valid = function(){

    if( !this.title
        ){
        logger.log('error', "Post invalid");
        return false;
    }else{
        return true;
    }
}


var Post = mongoose.model('Post', postSchema);

module.exports = Post;
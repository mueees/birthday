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
    date: Date,
    pubdate: String,
    guid: String,
    image: String,
    source: String,
<<<<<<< HEAD
    id_feed: String,
    isRead: Boolean
=======
    id_feed: String
>>>>>>> 3df8d1a9712e96caa5181a53e6cdbc35ae4de579
});


postSchema.methods.valid = function(){

    if( !this.date
        ){
        logger.log('error', "Post invalid");
        return false;
    }else{
        return true;
    }
}

var Post = mongoose.model('Post', postSchema);

module.exports = Post;
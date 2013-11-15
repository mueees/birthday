var _ = require('underscore'),
    util = require('util'),
    logger = require("libs/log")(module),
    $ = require('jquery'),
    jsdom = require("jsdom").jsdom,
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

    id_feed: String,
    isRead: Boolean,
    readLater: {
        type: Boolean,
        default: false
    }
});


postSchema.methods.valid = function(){

    if( !this.date ){
        logger.log('error', "Post invalid");
        return false;
    }else{
        return true;
    }
}

postSchema.methods.refactor = function(){
    //description - full text
    //summary - without any tags
    this._filterSummary();

    //if no image, get first image from post
    this._setImage();
}

postSchema.methods._filterSummary = function(){
    var description = this.description;
    if( !description ){
        this.summary = "";
        return false;
    }

    this.summary = this._replaceTag(this.summary);
}

postSchema.methods._replaceTag = function(string){
    return string.replace(/<(?:.|\n)*?>/gm, '');
}

postSchema.methods._setImage = function(){
    var _this = this;
    if( this.image ) return false;

    var images = $('<div>').html(this.description).find('img');

    images.each(function(i, image){
        if( _this.image ) return false;
        _this.image = $(image).attr('src');
    })

    if( !this.image ){
        this.image = "";
    }

}
postSchema.statics.getPosts = function(data, cb){

    var query = {
        id_feed: data.id_feed
    }
    this.find(query, null, {

        skip: data.getFrom,
        limit: data.count,
        sort: {
            date: -1 //Sort by Date Added DESC
        }

    }, cb);

}


var Post = mongoose.model('rss_post', postSchema);

module.exports = Post;
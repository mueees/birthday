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
    isRead: Boolean
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


var Post = mongoose.model('Post', postSchema);

module.exports = Post;
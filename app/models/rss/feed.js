var _ = require('underscore'),
    util = require('util'),
    async = require('async'),
    mongoose = require('mongoose'),
    FeedParser = require('feedparser'),
    request = require('request'),
    logger = require("libs/log")(module),
    Post = require('./post');

var Schema = mongoose.Schema;
var feedSchema = new Schema({
    name: String,
    url: String
});

feedSchema.methods.getPostsFromUrl = function(cb){

    var posts = [];

    request("http://tonsky.livejournal.com/data/rss")
        .on('error', function (error) {
            logger.log('error', { error: error });
            cb(error);
        })
        .pipe(new FeedParser())
        .on('error', function (error) {
            logger.log('error', { error: error });
            cb(error);
        })
        .on('readable', function() {
            var post;
            var stream = this;
            while (post = stream.read()) {
                posts.push({
                    title: post.title || "",
                    description: post.description || "",
                    summary: post.summary || "",
                    link: post.link || "",
                    date: post.date || "",
                    pubdate: post.pubdate || "",
                    guid: post.guid || "",
                    image: post.image || "",
                    source: post.source || ""
                });
            }
        })
        .on('end', function() {
            cb(null, posts);
        });
}

feedSchema.methods.updateFeed = function(globalCb){
    var _this = this;

    this.getPostsFromUrl(function(err, posts){
        if( err ) {
            globalCb(err);
            return false;
        }

        _this.postsRow = posts;
        _this.posts = [];

        _.each(posts, function(post){
            var postModel = new Post(post);

            if( postModel.valid() ){
                _this.posts.push(postModel);
            }
        })

        globalCb(null);

    });

}

var Feed = mongoose.model('Feed', feedSchema);

module.exports = Feed;

/*feedSchema.statics.test = function(){
 console.log("test");
 }
 feedSchema.methods.test = function(){
 console.log("test");
 }*/
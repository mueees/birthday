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


    async.waterfall([
        function(cb){

            _this.getPostsFromUrl(function(err, posts){
                if( err ) {
                    cb(err);
                    return false;
                }

                cb(null, posts);
            });

        },
        function(posts, cb){

            //get last post
            Post.findOne({}, {}, { sort: { 'date' : -1 } }, function(error, lastPost) {
                if(error){
                    cb(error);
                    return false;
                }

                cb(null, posts, lastPost);
            });


        },
        function(posts, lastPost, cb){

            _this.newPosts = [];
            _this.postsRow = posts;
            _this.posts = [];

            _.each(posts, function(post){

                post.id_feed = _this._id;
                post.date = new Date(post.date);

                var postModel = new Post(post);
                if( postModel.valid() ){
                    _this.posts.push(postModel);
                }

                if( lastPost ){
                    var lastDate = new Date(lastPost.date);
                    var postDate = new Date(post.date);

                    if( postDate <= lastDate ){
                        return false;
                    }else{
                        _this.newPosts.push(postModel);
                    }
                }else{
                    _this.newPosts.push(postModel);
                }

            })

            _.each(_this.newPosts, function(newPost){
                newPost.save(function(err){
                    if( err ){
                        console.log(err)
                        logger.log('error', {error: err});
                    }
                });
            })

            cb(null);

        }
    ], function(err){
        if( err ) {
            logger.log('error', {error: err});
            globalCb(err);
            return false;
        }

        globalCb(null);
    })



}



var Feed = mongoose.model('Feed', feedSchema);

module.exports = Feed;

/*feedSchema.statics.test = function(){
 console.log("test");
 }
 feedSchema.methods.test = function(){
 console.log("test");
 }*/
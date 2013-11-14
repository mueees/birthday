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

    request( this.url )
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
                    source: post.source || "",
                    isRead: false
                });
            }
        })
        .on('end', function() {
            cb(null, posts);
        });
}

feedSchema.methods.getLastPost = function(globalCb){
    //get last post

    if( !this._id ){
        globalCb(null, null);
    }
    var query = {id_feed: this._id};

    Post.findOne(query, {}, { sort: { 'date' : -1 } }, function(error, lastPost) {
        if(error){
            globalCb(error);
            return false;
        }

        globalCb(null, lastPost);
    });
}

feedSchema.methods._createPostModel = function(postsRow){
    var _this = this;
    this.posts = [];

    _.each( postsRow, function(postRow){
        postRow.id_feed = _this._id;
        postRow.date = new Date(postRow.date);

        var postModel = new Post(postRow);
        if( postModel.valid() ){
            postModel.refactor();
            _this.posts.push( postModel );
        }

    })
}

feedSchema.methods.sortNewPost = function(lastPost){
    var _this = this;
    this.newPosts = [];

    _.each(_this.posts, function(post){

        if( lastPost ){
            var lastDate = new Date(lastPost.date);
            var postDate = new Date(post.date);

            if( postDate <= lastDate ){
                return false;
            }else{
                _this.newPosts.push(post);
            }
        }else{
            _this.newPosts.push(post);
        }

    })
}

feedSchema.methods.saveNewPost = function(globalCb){
    var _this = this;

    var methods = [];

    _.each(_this.newPosts, function(newPost){
        methods.push(function(cb){
            newPost.save(function(err){
                if( err ){
                    logger.log('error', {error: err});
                    cb(err);
                    return false;
                }
                cb(null);
            });
        })
    })


    async.parallel(methods, function(err, results){
        if( err ){
            logger.log('error', {error: err});
            globalCb(err);
            return false;
        }
        globalCb(null);
    });
}

feedSchema.methods.loadFeed = function(globalCb){
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

            _this.postsRow = posts;
            _this._createPostModel(posts);

            _this.getLastPost(function(err, lastPost){
                if( err ) {
                    cb(err);
                    return false;
                }
                _this.sortNewPost(lastPost);
                cb(null);
            });

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

feedSchema.methods.updateFeed = function(globalCb){
    var _this = this;

    async.waterfall([
        function(cb){
            _this.loadFeed(cb);
        },
        function(cb){
            _this.saveNewPost(cb);
        },
    ], function(err){
        if( err ) {
            logger.log('error', {error: err});
            globalCb(err);
            return false;
        }


        globalCb(null);
    })
}

var Feed = mongoose.model('rss_feed', feedSchema);

module.exports = Feed;

/*feedSchema.statics.test = function(){
 console.log("test");
 }
 feedSchema.methods.test = function(){
 console.log("test");
 }*/
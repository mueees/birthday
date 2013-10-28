var async = require('async'),
    logger = require("libs/log")(module),
    Feed = require('models/rss/feed');

var state = {
    WORKER_PREPARE_TO_WORK: 1,
    WORKER_SUCCESS_DONE: 2,
    WORKER_ERROR: 3,
    WORKER_IN_WORKING_PROCESS: 4
}

function Worker( task ){
    this.state = state.WORKER_PREPARE_TO_WORK;
    this.task = task;
}

Worker.prototype = {

    loadFeed: function(){
        var _this = this;
        this.state = state.WORKER_IN_WORKING_PROCESS;
        this.start = new Date();

        if(!this._valid()) {
            this.error = "task is not valid";
            _this.calculateExecuteTime();
            return false;
        }

        async.waterfall([
            function(cb){
                //get feed
                _this._findFeed(cb);
            },
            function(feed, cb){
                _this.feed = feed;
                //get new post
                _this.feed.loadFeed(cb);
            }
        ], function(err){
            _this.calculateExecuteTime();

            if( err ){
                _this.error = err;
                _this.state = state.WORKER_ERROR;
                logger.log('error', { error: err });
                return false;
            }
            _this.state = state.WORKER_SUCCESS_DONE;
        });

    },

    updateFeed: function(){
        var _this = this;
        this.state = state.WORKER_IN_WORKING_PROCESS;
        this.start = new Date();

        if(!this._valid()) {
            this.error = "task is not valid";
            _this.calculateExecuteTime();
            return false;
        }

        async.waterfall([
            function(cb){
                //get feed
                _this._findFeed(cb);
            },
            function(feed, cb){
                _this.feed = feed;
                //get new post
                _this.feed.updateFeed(cb);
            }
        ], function(err){
            _this.calculateExecuteTime();

            if( err ){
                _this.error = err;
                _this.state = state.WORKER_ERROR;
                logger.log('error', { error: err });
                return false;
            }
            _this.state = state.WORKER_SUCCESS_DONE;
        });

    },

    calculateExecuteTime: function(){
        this.end = new Date();
        this.executeTime = this.end - this.start;
    },

    _findFeed: function(cb){
        var _this = this;

        Feed.findOne({_id: _this.task.data._id}, function(err, feed){
            if( err ) {
                cb(err);
                return false;
            }

            cb(null, feed);
        });
    },

    _valid: function(){
        return (this.task) ? true : false;
    },

    getNewPosts: function(){
        return this.feed.newPosts;
    },

    getPostsRow: function(){
        return this.feed.postsRow;
    },

    getPosts: function(){
        return this.feed.posts;
    }
}

module.exports = Worker;
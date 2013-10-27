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
    this.start = new Date();

    this.task = task;
    this.execute();
}

Worker.prototype = {
    execute: function(){
        var _this = this;
        this.state = state.WORKER_IN_WORKING_PROCESS;

        if(!this.valid()) return false;

        async.waterfall([
            function(cb){
                //get feed
                Feed.findOne({_id: _this.task.data._id}, function(err, feed){
                    if( err ) {
                        cb(err);
                        return false;
                    }

                    cb(null, feed);
                });
            },
            function(feed, cb){
                _this.feed = feed;

                //get new post
                _this.feed.updateFeed(function(err){
                    if( err ) {
                        cb(err);
                        return false;
                    }
                    cb(null);
                });

            }
        ], function(err){
            _this.executeTime = new Date() - _this.start;

            if( err ){
                _this.state = state.WORKER_ERROR;
                logger.log('error', { error: err });
                return false;
            }
            _this.state = state.WORKER_SUCCESS_DONE;
        });
    },

    valid: function(){
        return (this.task) ? true : false;
    },

    getPostsRow: function(){
        return this.feed.postsRow;
    },

    getPosts: function(){
        return this.feed.posts;
    }
}

module.exports = Worker;
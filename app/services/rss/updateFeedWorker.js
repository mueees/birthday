var cronJob = require('cron').CronJob,
    async = require('async'),
    _ = require('underscore'),
    logger = require("libs/log")(module),
    redis = require("redis"),
    Feed = require('models/rss/feed'),
    config = require("config"),
    clientRedis = redis.createClient( config.get('redis_settings:port'), config.get('redis_settings:host'));

clientRedis.auth(config.get('redis_settings:pass'))

var queue = [];

function UpdateFeedWorker(){
    _.bindAll(this, "setAllFeedToQueue");
}

UpdateFeedWorker.prototype = {

    init: function(){
        this.startJobByCron();
        console.log("UpdateFeedWorker started success");
    },

    startJobByCron: function(){
        new cronJob('* * * * * *', this.setAllFeedToQueue, null, true, "Europe/Kiev");
    },

    setAllFeedToQueue: function(){
        var _this = this;

        async.waterfall([
            function(cb){
                //получить все фиды
                Feed.find({}, function(err, feeds){
                    if( err ) {
                        cb(err);
                        return false;
                    }
                    cb(null, feeds);
                });
            },
            function(feeds, cb){
                //создать задачи и поместить в очередь

                if( !feeds.length ){
                    logger.log('info', "No feeds found");
                    return false;
                }

                //clientRedis.del(config.get('redis:queue:rss_feed_need_update'))

                _.each(feeds, function(feed){
                    var task = _this.makeTask(feed);
                    //add task to queue
                    clientRedis.rpush(config.get('redis:queue:rss_feed_need_update'),  JSON.stringify(task));
                });

                clientRedis.lrange(config.get('redis:queue:rss_feed_need_update'), 0, -1, function (err, tasks) {

                    if(err){
                        logger.log('error', {error: err});
                        return false;
                    }

                    console.log(tasks.length + " tasks:");
                    /*tasks.forEach(function (task, i) {
                        console.log("    " + i + ": " + task);
                    });*/
                });

                cb(null);
            }
        ], function(err){
            if( err ){
                logger.log('error', { error: err });
            }
        })

    },

    makeTask: function(feed){
        return {
            name: "updateFeed",
            data:{
                _id: feed._id
            }
        }
    }
}

module.exports = new UpdateFeedWorker();
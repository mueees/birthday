var cronJob = require('cron').CronJob,
    async = require('async'),
    _ = require('underscore'),
    logger = require("libs/log")(module),
    Feed = require('models/rss/feed');

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

                var tasks = [];

                _.each(feeds, function(feed){
                    tasks.push(_this.makeTask(feed));
                });

                queue = _.union(queue, tasks);

                cb(null);
            },
            function(){
                logger.log('info', queue.length);
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
var _ = require('underscore'),
    config = require("config"),
    redis = require("redis"),
    logger = require("libs/log")(module),
    clientRedis = redis.createClient( config.get('redis_settings:port'), config.get('redis_settings:host')),
    Worker = require('./worker'),
    workers = [],
    RecalculateUnread = require('action/rss/feed_recalculateUnread').RecalculateUnread;

clientRedis.auth(config.get('redis_settings:pass'))

function UpdateQueueManager(){
    this.opts = {
        maxWorkersCount: 10,
        maxTimeLiveworker: 10000   //  60000*1.5 - полторы минуты
    }
    _.bindAll(this, "monitorQueue", "monitorWorkers");
}

UpdateQueueManager.prototype = {
    init: function(){
        var _this = this;
        this.intervalQueue = setInterval(_this.monitorQueue, 200);
        this.intervalWorkers = setInterval(_this.monitorWorkers, 200);
    },

    monitorWorkers: function(){
        var i,
            max = workers.length,
            worker;

        for( i = 0; i < max; i++){
            worker = workers[i];

            if( worker.state == 2 ){
                //success state
                var posts = worker.getNewPosts();

                _.each(posts, function(post){
                    //add new post to rss_new_feed redis list
                    clientRedis.rpush(config.get('redis:queue:rss_new_feed'),  JSON.stringify(post));
                });

                var recalculateUnread = new RecalculateUnread()
                recalculateUnread.execute( worker.getFeedId() );

                //delete worker
                worker = null;

                workers.splice(i, 1);

                i--;
                max--;

            }else if( worker.state == 3 ){
                //error state
                //return task to queue
                //clientRedis.rpush(config.get('redis:queue:rss_feed_need_update'),  JSON.stringify(worker.task));
                worker = null;
                workers.splice(i, 1);
                i--
                max--
            }else if( worker.state == 4 ){
                var executeTime = new Date() - worker.start;
                if( executeTime > this.opts.maxTimeLiveworker ){
                    worker = null;
                    workers.splice(i, 1);
                    i--
                    max--
                }
            }

        }

        if( workers.length > 0 ){
            console.log(new Date());
            console.log("Workers length: " + workers.length);
        }


    },

    monitorQueue: function(){

        var worker;


        if( this.opts.maxWorkersCount < workers.length ){
            return false;
        }

        clientRedis.lpop(config.get('redis:queue:rss_feed_need_update'), function(err, task) {
            if(err){
                logger.log('error', {error:err});
                return false;
            }

            if( !task ){
                logger.log('info', "No task");
                return false;
            }

            task = JSON.parse(task);

            if( !task.name || !task.data) {
                logger.log('info', "Invalid task");
                return false
            };

            worker = new Worker(task);
            workers.push( worker );

            worker.updateFeed();
        });
    }
}

module.exports = new UpdateQueueManager();
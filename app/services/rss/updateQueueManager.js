var _ = require('underscore'),
    config = require("config"),
    redis = require("redis"),
    logger = require("libs/log")(module),
    clientRedis = redis.createClient( config.get('redis_settings:port'), config.get('redis_settings:host')),
    Worker = require('./worker'),
    workers = [];

clientRedis.auth(config.get('redis_settings:pass'))

function UpdateQueueManager(){
    this.opts = {
        maxWorkersCount: 10
    }
    _.bindAll(this, "monitorQueue", "monitorWorkers");
}

UpdateQueueManager.prototype = {
    init: function(){
        var _this = this;
        this.intervalQueue = setInterval(_this.monitorQueue, 200);
        this.intervalWorkers = setInterval(_this.monitorWorkers, 0);

        //this.monitorQueue();
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

                delete workers[i];

            }else if( worker.state == 3 ){
                //error state
                //return task to queue
                clientRedis.rpush(config.get('redis:queue:rss_feed_need_update'),  JSON.stringify(worker.task));
            }
        }

    },

    monitorQueue: function(){

        var worker;

        if( this.opts.maxWorkersCount < workers ) return false;

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
            worker = new Worker(task);
            workers.push( worker );

            worker.updateFeed();
        });
    }
}

module.exports = new UpdateQueueManager();
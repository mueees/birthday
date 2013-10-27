var _ = require('underscore'),
    redis = require("redis"),
    logger = require("libs/log")(module),
    clientRedis = redis.createClient(),
    Worker = require('./worker'),
    config = require("config");
    workers = [];

function UpdateQueueManager( options ){
    _.bindAll(this, "monitorQueue");
}

UpdateQueueManager.prototype = {
    init: function(){
        var _this = this;
        this.intervalQueue = setInterval(_this.monitorQueue, 200);
        //this.intervalWorkers = setInterval(_this.monitorWorkers, 0);

        //_this.monitorQueue();
    },

    monitorWorkers: function(){
        var i,
            max = workers.length,
            worker;


        for( i = 0; i < max; i++){
            worker = workers[i];
            if( worker.state == 2 ){
                var posts = worker.getPosts();
            }
        }


    },

    monitorQueue: function(){

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
            workers.push( new Worker(task) );
        });
    }
}

module.exports = new UpdateQueueManager();
var _ = require('underscore'),
    Worker = require('./worker'),
    workers = [];

var queue = [
    {
        name: 'updateFeed',
        data: {
            _id: "526a7ff8707984dc07000001"
        }
    },
    {
        name: 'updateFeed',
        data: {
            _id: "526a7ff8707984dc07000002"
        }
    },
    {
        name: 'updateFeed',
        data: {
            _id: "526a7ff8707984dc07000003"
        }
    }
]

function UpdateQueueManager( options ){
    _.bindAll(this, "monitorQueue");
}

UpdateQueueManager.prototype = {
    init: function(){
        var _this = this;
        this.interval = setInterval(_this.monitorQueue, 500);
    },

    monitorQueue: function(){
        var i,
            max = queue.length,
            task;

        workers = [];

        for( i = 0; i < max; i++ ){
            task =  queue[i];
            workers.push( new Worker(task) );
        }

        queue = [];

    }
}

module.exports = new UpdateQueueManager();
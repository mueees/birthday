function UpdateFeedWorker(){}
UpdateFeedWorker.prototype = {
    start: function(){
        console.log("UpdateFeedWorker started");
    }
}

module.exports = UpdateFeedWorker;
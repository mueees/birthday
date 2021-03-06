//websocket

var done = _.bind(this.subscribeNewTweetSuccess, this);
var fail = _.bind(this.subscribeNewTweetError, this);

var request = {
    method: App.config.api.twitter.subscribe,
    params: {}
}

$.when( App.request('websocket:send', request)).fail(fail).done(done);
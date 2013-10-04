/* server -> client */

//response
var response = {
    result: {},
    error: {},
    id: this.id
}

//publish
socketServer.channel.emit("toClientChannel", {
    params: params,
    channel: "twitter:newTweet"
});


/* client -> server */

//request
$.when( App.request('websocket:send', addListenerRequest)).fail(
    function(){debugger}
).done(
    function(){debugger}
);

// get publish
App.channels.websocket.on(App.config.s.twitter.newTweet, function(data){

});
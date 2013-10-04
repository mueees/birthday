var twitter = require("twitter");

module.exports = function(server){

    //twitter
    server.use('/twitter/subscribe', twitter.subscribe);
    server.use('/twitter/unsubscribe', twitter.unsubscribe);
    //server.use('/twitter/changeChannel', twitter.changeChannel);

}
var twitter = require("twitter");

module.exports = function(server){

    //twitter
    server.use('/twitter/addListener', twitter.addListener);
    //server.use('/twitter/changeChannel', twitter.changeChannel);

}
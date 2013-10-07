var twitter = require("twitter");
var twitterController = require('../controllers/twitter');

module.exports = function(server){

    //twitter
    server.use('/twitter/subscribe', twitter.subscribe);
    server.use('/twitter/unsubscribe', twitter.unsubscribe);
    server.use('/twitter/unsubscribe', twitter.unsubscribe);

    server.use('/twitter/stream/delete', twitterController.deleteStream);

    server.use("/api/twitter/getStreams/findAll", twitterController.getStreams);
    server.use("/api/twitter/stream/create", twitterController.saveNewStream);



    //server.use('/twitter/changeChannel', twitter.changeChannel);

}
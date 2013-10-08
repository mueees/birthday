var twitterController = require('../controllers/twitter');

module.exports = function(server){

    //twitter
    server.use('/twitter/subscribe', twitterController.subscribe);
    server.use('/twitter/unsubscribe', twitterController.unsubscribe);

    server.use("/api/twitter/getStreams/findAll", twitterController.getStreams);
    server.use("/api/twitter/stream/create", twitterController.saveNewStream);
    server.use('api/twitter/stream/delete', twitterController.deleteStream);
    server.use('api/twitter/stream/update', twitterController.updateStream);

    server.use('/twitter/changeChannel', twitterController.changeChannel);

}
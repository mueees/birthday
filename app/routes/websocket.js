var twitterController = require('../controllers/twitter');
var rssController = require('../services/rss/controller/rss');

module.exports = function(server){

    //twitter
    server.use('/twitter/subscribe', twitterController.subscribe);
    server.use('/twitter/unsubscribe', twitterController.unsubscribe);

    server.use("/api/twitter/getStreams/findAll", twitterController.getStreams);
    server.use("/api/twitter/stream/create", twitterController.saveNewStream);
    server.use('/api/twitter/stream/delete', twitterController.deleteStream);
    server.use('/api/twitter/stream/update', twitterController.updateStream);
    server.use('/twitter/changeChannel', twitterController.changeChannel);

    //rss
    server.use('/api/rss/category/create', rssController.categoryCreate);
    server.use('/api/rss/category/update', rssController.categoryUpdate);
    server.use('/api/rss/category/delete', rssController.categoryDelete);
    server.use('/api/rss/categories/findAll', rssController.categoryFindAll);
    server.use('/api/rss/categories/update', rssController.categoriesUpdate);
    server.use('/api/rss/getFeedsByUrl/findAll', rssController.getFeedsByUrl);

    server.use('/api/rss/feed/create', rssController.feedCreate);
    server.use('/api/rss/feed/delete', rssController.feedDelete);
    server.use('/api/rss/feed/find', rssController.feedFind);

    server.use('/api/rss/getPostsByCreteria', rssController.getPostsByCreteria);
    server.use('/api/rss/post/postReadLater', rssController.postReadLater);
    server.use('/api/rss/post/changeIsReadState', rssController.changeIsReadState);
    server.use('/api/rss/post/setAllPostUnread', rssController.setAllPostUnread);

    
}

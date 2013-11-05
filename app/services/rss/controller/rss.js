var CategoryModel = require('models/rss/category'),
    SocketError = require('socketServer/error').SocketError,
    Feed = require('models/rss/feed'),
    url = require('url');

var controller = {

    getFeedsByUrl: function( req, res, next ){
        var data = req.body || req.params;

        if( !data.feed_url ){
            next( new SocketError(400, "Url is required") );
            return false;
        }

        if(!url.parse( data.feed_url ).protocol) {
            next( new SocketError(400, "Cannot parse url") );
            return false;
        }

        var feed = new Feed({
            url: data.feed_url
        });

        feed.loadFeed(function(err){
            if( err ){
                next( new SocketError(400, "Cannot download feeds") );
                return false;
            }

            //тут в будущем будет много фидов, которые были найдены по указаному пользователем url
            res.send([
                {
                    name: data.feed_url,
                    posts: feed.postsRow,
                    url: data.feed_url
                }
            ]);
        });

    },

    categoryFindAll: function(req, res, next){
        res.send([
                {
                    _id: "cat1",
                    name: "cat1",
                    feeds: [
                        {
                            _id: "feed1",
                            name: 'feed1',
                            unread: 5
                        }
                    ]
                },
                {
                    _id: "cat12",
                    name: "cat2",
                    feeds: [
                        {
                            _id: "feed1",
                            name: 'feed1',
                            unread: 7
                        },
                        {
                            _id: "feed2",
                            name: 'feed2',
                            unread: 2
                        }
                    ]
                }
            ]);
    },

    categoryCreate: function(req, res, next){
        var data = req.body || req.params;
        var category = new CategoryModel(data);

        category.save(function(err){
            if(err){
                next( new SocketError(400, "Cannot save new Category") );
                return false;
            }
            res.send(category);
        })

    },
    categoryUpdate: function(req, res, next){
        var _id = req.params._id;
        var update = req.params;
        delete update._id;

        CategoryModel.update({ _id: _id }, update, function(err, numberAffected, raw){

            if(err){
                next( new SocketError(400, "Cannot update stream") );
                return false;
            }

            res.send({
                result: req.params
            })

        })
    },
    categoryDelete: function(req, res, next){

        var _id = req.params._id;
        if(!_id){
            next( new SocketError(400, "Cannot delete category") );
        }

        CategoryModel.find({ _id: _id }, function(err, streams){
            if(err){
                next( new SocketError(400, "Cannot find category") );
                return false;
            }

            if( !streams.length ){
                next( new SocketError(400, "Cannot find category") );
                return false;
            }

            streams[0].remove(function(err, stream){
                if( err ){
                    next( new SocketError(400, "Cannot remove category") );
                    return false;
                }

                res.send();
            });

        })
    }
}

module.exports = controller;
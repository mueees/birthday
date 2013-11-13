var CategoryModel = require('models/rss/category'),
    FeedModel = require('models/rss/feed'),
    SocketError = require('socketServer/error').SocketError,
    Feed = require('models/rss/feed'),
    Post = require('models/rss/post'),
    async = require('async'),
    _ = require('underscore'),
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
            res.send({
                    feeds: [{
                        name: data.feed_url,
                        posts: feed.posts,
                        url: data.feed_url
                    }]
                }
            );
        });

    },

    categoryFindAll: function(req, res, next){
        var _this = this;

        CategoryModel.find({}, function(err, categories){
            if(err){
                next( new SocketError(400, "Cannot get Categories") );
                return false;
            }

            Feed.find({}, function(err, feeds){
                if(err){
                    next( new SocketError(400, "Cannot get Feeds") );
                    return false;
                }

                var categoriesFull = controller._unionCategoriesAndFeeds(categories, feeds);
                res.send(categoriesFull);
            })

            
        });
    },

    getPostsByCreteria: function( req, res, next ){
        var _this = this;
        var data = req.body || req.params;

        if( !data.id_feed ){
            next( new SocketError(400, "Id_feed is required") );
            return false;
        }

        Post.getPosts(data, function(err, posts){
            if(err){
                next( new SocketError(400, "Cannot get posts") );
                return false;
            }

            res.send(posts);
        })
        
    },

    _unionCategoriesAndFeeds: function(categories, feeds){
        var result = [];
        var _this = this;

        _.each( categories, function(category){
            var feedsToData = [];
            var categoryFeeds = category.feeds;

            if( categoryFeeds && categoryFeeds.length ){
                _.each(categoryFeeds, function(feedId){
                    var feedObj = _this._findFeedById(feedId, feeds);
                    feedsToData.push(feedObj)
                })
            }

            category.feeds = feedsToData;
            result.push(category);
        })
        return result;
    },

    _findFeedById: function(id, feeds){
        var result = _.filter(feeds, function(feed){
            return feed._id == id;
        });

        return result[0];
    },

    _getUnicFeedId: function( categories ){
        var unicFeedId = [];

        _.each( categories, function(category){
            var feeds = category.feeds;

            if(!feeds.length) return false;

            _.union(unicFeedId, feeds);
        })

        return unicFeedId;
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

    categoriesUpdate: function(req, res, next){
        var categories = req.params;

        if( !categories.length ){
            next( new SocketError(400, "No categories") );
            return false;
        }

        var methods = [];

        _.each(categories, function(category){

            methods.push(function(cb){

                var _id = category._id;
                delete category._id;

                CategoryModel.update({ _id: _id }, category, function(err, numberAffected, raw){
                    if(err){
                        next( new SocketError(400, err) );
                        return false;
                    }
                    cb(null);
                })

            })
        })

        async.parallel(methods, function(err, results){
            if( err ){
                logger.log('error', {error: err});
                globalCb(err);
                return false;
            }
            
            res.send();

        });

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
    },

    feedCreate: function(req, res, next){
        var data = req.body || req.params;
        var feed = new FeedModel(data);

        feed.save(function(err){
            if(err){
                next( new SocketError(400, "Cannot save new Feed") );
                return false;
            }
            res.send({
                _id: feed._id
            });
        })
    },

    feedFind: function(req, res, next){
        var data = req.body || req.params;

        if( !data._id ){
            next( new SocketError(400, "Id is required") );
            return false;
        }

        FeedModel.find({ _id: data._id }, function(err, feed){
            if(err){
                next( new SocketError(400, "Cannot get Feed") );
                return false;
            }

            if( !feed.length ){
                res.send({});
            }else{
                res.send(feed[0]);
            }

        });
    }
}

module.exports = controller;
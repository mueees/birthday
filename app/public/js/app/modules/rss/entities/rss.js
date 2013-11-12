define([
    'jquery',
    'backbone',
    'marionette',
    'app/app',

    /*models*/
    "../models/post",
    "../models/feed",

    /*collections*/
    '../collections/posts',
    '../collections/categories'

], function(jQuery, Backbone, Marionette, App, PostModel, FeedModel, PostsColl, CategoriesColl){

    var API = {

        getFeed: function(data){
            var feed = new FeedModel(data);
            var deferred = $.Deferred();

            feed.fetch({
                success: function(model, data){
                    deferred.resolve({
                        model: new FeedModel(data)
                    })
                },
                error: function(model, xhr){
                    deferred.reject({
                        model: feed,
                        xhr: xhr
                    })
                }
            })

            return deferred.promise();
        },

        getPost: function(data){
            var post = new PostModel(data);
            var deferred = $.Deferred();

            post.fetch({
                success: function(model, data){
                    deferred.resolve({
                        model: new PostModel(data)
                    })
                },
                error: function(model, xhr){
                    deferred.reject({
                        model: stream,
                        xhr: xhr
                    })
                }
            })


            return deferred.promise();
        },

        getPosts: function(data){
            var postsCollection = new PostsColl();
            var deferred = $.Deferred();

            postsCollection.fetch({
                data: data,
                success: function(model, data){
                    deferred.resolve({
                        postsCollection: postsCollection
                    })
                },
                error: function(model, xhr){
                    deferred.reject({
                        model: stream,
                        xhr: xhr
                    })
                }
            })

            return deferred.promise();
        },

        getCategories: function(){

            var categoriesColl = new CategoriesColl();
            var deferred = $.Deferred();

            categoriesColl.fetch({
                success: function(model, data){
                    deferred.resolve({
                        categoriesColl: categoriesColl
                    })
                },
                error: function(model, xhr){
                    deferred.reject({
                        xhr: xhr
                    })
                }
            })

            return deferred.promise();
        }
    }

    App.reqres.setHandler('rss:getFeed', function(data){
        return API.getFeed(data);
    })

    App.reqres.setHandler('rss:getPost', function(data){
        return API.getPost(data);
    })

    App.reqres.setHandler('rss:getPosts', function(data){
        return API.getPosts(data);
    })

    App.reqres.setHandler('rss:getCategories', function(data){
        return API.getCategories(data);
    })

})
define([
    'jquery',
    'backbone',
    'marionette',
    'app/app',

    'app/collections/blog/post',
    'app/models/blog/post'

], function(jQuery, Backbone, Marionette, App, PostCollection, PostModel){

    var API = {

        saveNewPost: function( data ){

            var post = new PostModel(data);
            var deferred = $.Deferred();

            post.save(null,{
                success: function(model, data){
                    deferred.resolve({
                        model: new PostModel(data)
                    })
                },
                error: function(model, xhr){
                    deferred.reject({
                        model: event,
                        xhr: xhr
                    })
                }
            });

            return deferred.promise();
        },

        getPosts: function(data){
            var deferred = $.Deferred();
            this._getPosts(data, deferred);
            return deferred.promise();
        },

        _getPosts: function(data, deferred){
            var postCollection = new PostCollection();

            postCollection.fetch({
                type: "GET",
                data: data,
                success: function(){
                    deferred.resolve({
                        postCollection: postCollection
                    });
                },
                error: function(){
                    deferred.reject({});
                }
            });
        },

        getPostsbyId: function(data){
            var deferred = $.Deferred();
            this._getPostsById(data, deferred);
            return deferred.promise();
        },

        _getPostsById: function(data, deferred){

            var postCollection = new PostCollection();

            postCollection.fetch({
                type: "GET",
                data: data,
                success: function(){
                    deferred.resolve({
                        postCollection: postCollection
                    });
                },
                error: function(){
                    deferred.reject({});
                }
            });
        }
    }

    App.reqres.setHandler('blog:saveNewPost', function( data ){
        return API.saveNewPost( data );
    })

    App.reqres.setHandler('blog:getPosts', function( data ){
        return API.getPosts( data );
    })

    App.reqres.setHandler('blog:getPostsById', function( data ){
        return API.getPostsbyId( data );
    })
})
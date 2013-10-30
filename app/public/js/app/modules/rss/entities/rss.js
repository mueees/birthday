define([
    'jquery',
    'backbone',
    'marionette',
    'app/app',

    /*models*/
    "../models/post",

    /*collections*/
    '../collections/posts'

], function(jQuery, Backbone, Marionette, App, PostModel, PostsColl){

    var API = {

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

        /*saveNewStream: function( data ){

            var stream = new StreamModel(data);
            var deferred = $.Deferred();

            stream.save(null,{
                success: function(model, data){
                    deferred.resolve({
                        model: new StreamModel(data)
                    })
                },
                error: function(model, xhr){
                    deferred.reject({
                        model: stream,
                        xhr: xhr
                    })
                }
            });

            return deferred.promise();
        },

        getStreams: function(){
            var deferred = $.Deferred();
            var streamCollection = new StreamCollection();

            streamCollection.fetch({
                success: function(){
                    deferred.resolve({
                        streamCollection: streamCollection
                    });
                },
                error: function(){
                    deferred.resolve({});
                }
            });

            return deferred.promise();
        },

        addListener: function(){
            var deferred = $.Deferred();

            return deferred.promise();
        }*/
    }

    App.reqres.setHandler('rss:getPost', function(data){
        return API.getPost(data);
    })

    App.reqres.setHandler('rss:getPosts', function(data){
        return API.getPosts(data);
    })

})
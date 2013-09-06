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
        }
    }

    App.reqres.setHandler('blog:saveNewPost', function( data ){
        return API.saveNewPost( data );
    })
})
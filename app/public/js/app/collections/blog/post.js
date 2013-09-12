define([
    'app/app',
    'backbone',
    'marionette',
    'app/models/blog/post',
    'app/collections/_base/collection'
],function(App, Backbone, Marionette, PostModel, BaseColletion){

    return BaseColletion.extend({
        model: PostModel,
        url: App.config.api.getPosts,

        parse: function(response){
            for( var i = 0; i < response.length; i++ ){
                var post = response[i];

                post.date = new Date(post.date);
                this.push(post);
            }

            return this.models;
        }
    })

})
define([
    'backbone',
    'marionette',
    '../models/post',
    'app/collections/_base/collection'
],function(Backbone, Marionette, PostModel, BaseColletion){

    return BaseColletion.extend({
        model: PostModel,
        url: "/api/rss/posts"
    })

})
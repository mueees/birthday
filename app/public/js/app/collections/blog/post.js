define([
    'backbone',
    'marionette',
    'app/models/blog/post',
    'app/collections/_base/collection'
],function(Backbone, Marionette, PostModel, BaseColletion){

    return BaseColletion.extend({
        model: PostModel
    })

})
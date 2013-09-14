define([
    'app/app',
    'backbone',
    'marionette',
    'app/models/timeline/post',
    'app/collections/_base/collection'
],function(App, Backbone, Marionette, PostModel, BaseColletion){

    return BaseColletion.extend({
        model: PostModel
    })

})
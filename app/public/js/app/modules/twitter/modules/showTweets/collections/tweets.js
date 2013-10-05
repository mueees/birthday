define([
    'app/app',
    'backbone',
    'marionette',
    '../models/tweet',
    'app/collections/_base/collection'
],function(App, Backbone, Marionette, TweetModel, BaseColletion){
    return BaseColletion.extend({
        model: TweetModel
    })

})
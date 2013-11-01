define([
    'backbone',
    'marionette',
    '../models/feed',
    'app/collections/_base/collection'
],function(Backbone, Marionette, FeedModel, BaseColletion){

    return BaseColletion.extend({
        model: FeedModel,
        url: "/api/rss/feeds"
    })

});
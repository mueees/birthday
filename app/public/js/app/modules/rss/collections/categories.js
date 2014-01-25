define([
    'backbone',
    'marionette',
    '../models/category',
    'app/collections/_base/collection'
],function(Backbone, Marionette, CategoryModel, BaseColletion){

    return BaseColletion.extend({
        model: CategoryModel,

        url: function(){
            return "/api/rss/categories"
        },

        socket: true,

        getDataForUpdate: function(){
            var dataToSave = [];
            var data = this.toJSON();

            _.each(data, function(category){
                var feedsForSave = [];
                var feeds = category.feeds;

                _.each(feeds, function(feed){
                    var _id = feed._id;
                    if(!_id) return false;

                    feedsForSave.push(_id);
                })

                category.feeds = feedsForSave;

                dataToSave.push(category);
            })
            return dataToSave;
        },

        getFeedById: function(id){
            var model;

            this.each(function(category, i){
                if(model) return;
                category.get('feeds').each(function(feed, i){
                    if( feed.get('_id') == id ){
                        model = feed;
                        return;
                    }
                })
            })
            return model;
        }
    })

})
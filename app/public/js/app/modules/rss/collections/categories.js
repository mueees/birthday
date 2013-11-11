define([
    'backbone',
    'marionette',
    '../models/category',
    'app/collections/_base/collection'
],function(Backbone, Marionette, CategoryModel, BaseColletion){

    return BaseColletion.extend({
        model: CategoryModel,
        url: "/api/rss/categories",
        socket: true,
        save: function(){
            Backbone.sync('create', this, {
                success: function() {
                    console.log('Saved!');
                }
            });
        }
    })

})
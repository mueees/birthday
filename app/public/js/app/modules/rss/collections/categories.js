define([
    'backbone',
    'marionette',
    '../models/category',
    'app/collections/_base/collection'
],function(Backbone, Marionette, CategoryModel, BaseColletion){

    return BaseColletion.extend({
        model: CategoryModel,
        url: "/api/rss/categories",
        socket: true
    })

})
define([
    'app/app',
    'backbone',
    'marionette',
    'app/models/task/list',
    'app/collections/_base/collection'
],function(App, Backbone, Marionette, ListModel, BaseColletion){

    return BaseColletion.extend({
        model: ListModel,
        url: App.config.api.getTaskList
    })

})
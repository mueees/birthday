define([
    'app/app',
    'backbone',
    'marionette',
    'app/models/_base/model'
],function(App, Backbone, Marionette, BaseModel){

    return BaseModel.extend({
        defaults: {
            title: "",
            description: "",
            isDone: false,
            date: "",
            listId: ""
        },
        idAttribute: '_id',
        urlRoot: App.config.api.taskList
    })

})
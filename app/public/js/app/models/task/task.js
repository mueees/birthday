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
            listId: "",
            isSaved: false
        },
        idAttribute: '_id',
        urlRoot: App.config.api.task,

        parse: function (response) {
            response.date = new Date(response.date);
            return response;
        }
    })

})
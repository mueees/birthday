define([
    'app/app',
    'backbone',
    'marionette',
    'app/models/_base/model'
],function(App, Backbone, Marionette, BaseModel){

    return BaseModel.extend({
        defaults: {
            name: "",
            text: "",
            people: "",
            language: []
        },
        idAttribute: '_id',
        urlRoot: App.config.api.stream
    })

})
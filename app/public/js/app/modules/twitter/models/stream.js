define([
    'app/app',
    'backbone',
    'marionette',
    'app/models/_base/model'
],function(App, Backbone, Marionette, BaseModel){

    return BaseModel.extend({
        defaults: {
            name: "",
            track: "",
            people: "",
            language: []
        },
        idAttribute: '_id',
        urlRoot: App.config.api.stream
    })

})
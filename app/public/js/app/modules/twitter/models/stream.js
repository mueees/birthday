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
        socket: true,
        idAttribute: '_id',
        url: function(){
            return App.config.api.stream
        },
        urlRoot: App.config.api.stream
    })

})
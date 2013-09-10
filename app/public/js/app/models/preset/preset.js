define([
    'app/app',
    'backbone',
    'marionette',
    'app/models/_base/model'
],function(App, Backbone, Marionette, BaseModel){

    return BaseModel.extend({
        defaults: {
            name: "",
            classes: "",
            width: ""
        },
        idAttribute: '_id',
        urlRoot: App.config.api.preset
    })

})
define([
    'app/app',
    'backbone',
    'marionette',
    'app/models/_base/model'
],function(App, Backbone, Marionette, BaseModel){

    return BaseModel.extend({
        defaults: {
            title: "",
            body: "",
            date: "",
            previewTitle: "",
            previewImg: "",
            preset: "",
            tags: []
        },
        idAttribute: '_id',
        urlRoot: App.config.api.post
    })

})
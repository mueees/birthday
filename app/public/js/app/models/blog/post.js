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
            tags: [],
            privateType: 'public'
        },
        idAttribute: '_id',
        urlRoot: App.config.api.post,

        parse: function (response) {
            response.date = new Date(response.date);
            return response;
        }
    })

})
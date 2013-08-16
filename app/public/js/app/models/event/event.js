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
            dateStart:{
                fullValue: "",
                year: "",
                month: "",
                day: "",
                hour: "",
                minute: ""
            },
            repeat: {
                repeatType: "",
                repeatEnds: "",
                repeatDays: []
            }
        },
        idAttribute: '_id',
        urlRoot: App.config.api.event
    })

})
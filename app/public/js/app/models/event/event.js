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
                year: "",
                month: "",
                day: "",

                start: {
                    hour: "",
                    minute: ""
                },
                end: {
                    hour: "",
                    minute: ""
                },

                dateStartObj: ""
            },

            repeat: {
                repeatType: "",
                repeatEnds: "",
                dateRepeatEnd: {
                    repeatEndsObj: "",
                    year: "",
                    month: "",
                    day: ""
                },
                repeatDays: []
            }
        },
        idAttribute: '_id',
        urlRoot: App.config.api.event
    })

})
define([
    'app/app',
    'backbone',
    'marionette',
    'app/models/_base/model'
],function(App, Backbone, Marionette, BaseModel){

    // модель служит только для отображения
    // в поле _idRaw хранит ссылку на запись row с помощью которой эта модель была построена

    return BaseModel.extend({
        defaults: {
            title: "",
            description: "",
            _idRaw: "",

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
                }
            }
        },
        idAttribute: '_id',
        urlRoot: App.config.api.event
    })

})
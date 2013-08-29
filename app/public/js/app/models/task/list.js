define([
    'app/app',
    'backbone',
    'marionette',
    'app/models/_base/model'
],function(App, Backbone, Marionette, BaseModel){

    return BaseModel.extend({
        defaults: {
            name: "",
            surName: "",
            middleName: "",

            dateBirthday: {
                day: "day",
                month: "month",
                year: "year"
            },
            wishes: [],
            skypes: [],
            phones: [],
            realAddresses: [],
            emails: [],

            age: 0
        },
        idAttribute: '_id',
        urlRoot: App.config.api.taskList
    })

})
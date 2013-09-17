define([
    'app/app',
    'backbone',
    'marionette',
    'app/models/_base/model'
],function(App, Backbone, Marionette, BaseModel){

    return BaseModel.extend({
        defaults: {
            name: "",
            type: "",
            path: "",
            size: "",
            description: ""
        }/*

        parse: function (response) {
            response.date = new Date(response.date);
            return response;
        }*/
    })

})
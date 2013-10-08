define([
    'app/app',
    'marionette',
    'backbone',

    /*modules*/
    'app/modules/websocket/websocket_app',
    'app/modules/websocket/entities/websocket'


], function(App, Marionette, Backbone){


    Backbone.Websocket = function(){}

    _.extend(Backbone.Websocket, {

        create: function(model){

            return  App.request('websocket:send', {
                method: model.url() + "/create",
                params: model.toJSON()
            });

        },

        destroy: function(model){
            if (model.isNew()) return false;

            if( !model.urlRoot ) {
                alert("urlRoot should be defined");
                return false;
            }

            return App.request('websocket:send', {
                method: model.urlRoot + "/delete",
                params: model.toJSON()
            });
        },

        update: function(model){

            if( !model.urlRoot ) {
                alert("urlRoot should be defined");
                return false;
            }

            return App.request('websocket:send', {
                method: model.urlRoot + "/update",
                params: model.toJSON()
            });
        },

        read: function(model){
            return App.request('websocket:send', {
                method: model.url() + "/get",
                params: model.toJSON()
            });
        },

        find: function(model){
            return App.request('websocket:send', {
                method: model.url + "/find",
                params: model.toJSON()
            });
        },

        findAll: function(model){
            return App.request('websocket:send', {
                method: model.url + "/findAll",
                params: model.toJSON()
            });
        }

    })

    Backbone.Websocket.sync = function(method, model, options){

        var deff;

        switch (method){
            case "create":
                deff = Backbone.Websocket.create(model);
                break
            case "delete":
                deff = Backbone.Websocket.destroy(model);
                break
            case "update":
                deff = Backbone.Websocket.update(model);
                break;
            case "read":
                deff = model.id != undefined ? Backbone.Websocket.find(model) : Backbone.Websocket.findAll(model)
                break;
        }

        var done = function(params){
            options.success(params);
        }
        var fail = function(params){
            options.error(params);
        }

        deff.done(done).fail(fail);

        return deff;

    }
    Backbone.ajaxSync = Backbone.sync;
    Backbone.getSyncMethod = function(model) {

        if(model.socket) {
            return Backbone.Websocket.sync;
        }

        return Backbone.ajaxSync;
    };
    Backbone.sync = function(method, model, options) {
        return Backbone.getSyncMethod(model).apply(this, [method, model, options]);
    };

})
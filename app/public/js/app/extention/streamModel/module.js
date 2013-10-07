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

            var deff = App.request('websocket:send', {
                method: model.url() + "/delete",
                params: model.toJSON()
            });
            return deff;
        },

        update: function(model){

            var deff = App.request('websocket:send', {
                method: model.url() + "/update",
                params: model.toJSON()
            });
            return deff;
        },

        read: function(model){
            var deff = App.request('websocket:send', {
                method: model.url() + "/get",
                params: model.toJSON()
            });
            return deff;
        },

        find: function(model){
            var deff = App.request('websocket:send', {
                method: model.url + "/find",
                params: model.toJSON()
            });
            return deff;
        },

        findAll: function(model){
            var deff = App.request('websocket:send', {
                method: model.url + "/findAll",
                params: model.toJSON()
            });
            return deff;
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

    /*setTimeout(function(){

        var Stream = Backbone.Model.extend({
            url: "/testurl",
            socket: true
        });
        var stream = new Stream();
        stream.set("id", 'test');

        stream.on("destroy", function(){
            debugger
        })
        stream.destroy();
        stream.set("some", "sdfsf");
        stream.save();


    }, 1500)*/

})
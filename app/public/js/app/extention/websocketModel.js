define([
    'app/app',
    'marionette',
    'backbone',

    /*modules*/
    'app/modules/websocket/websocket_app',
    'app/modules/websocket/entities/websocket'


], function(App, Marionette, Backbone){


    Backbone.Websocket = function(){}

    function url () {
      var base = _.result(this, 'urlRoot') || _.result(this.collection, 'url') || urlError();
      if (this.isNew()) return base;
      return base + (base.charAt(base.length - 1) === '/' ? '' : '/') + encodeURIComponent(this.id);
    }

    _.extend(Backbone.Websocket, {

        getRequest: function(model, type, options){
            return _.extend({
                method: model.url() + "/" + type,
                params: model.toJSON()
            }, options)
        },

        create: function(model, request){
            return  App.request('websocket:send', request);
        },

        destroy: function(model, request){
            if (model.isNew()) return false;
            return App.request('websocket:send', request);
        },

        update: function(model, request){
            return App.request('websocket:send', request);
        },

        read: function(model, request){
            return App.request('websocket:send', request);
        },

        find: function(model, request){
            return App.request('websocket:send', request);
        },

        findAll: function(model, request){
            return App.request('websocket:send', request);
        }

    })

    Backbone.Websocket.sync = function(method, model, options){

        var deff,
            done,
            type,
            request,
            fail;
        switch (method){
            case "create":
                type = 'create';
                request = Backbone.Websocket.getRequest(model, type, options);
                deff = Backbone.Websocket.create(model, request);
                break
            case "delete":
                type = 'delete';
                request = Backbone.Websocket.getRequest(model, type, options);
                deff = Backbone.Websocket.destroy(model, request);
                break
            case "update":
                type = 'update';
                request = Backbone.Websocket.getRequest(model, type, options);
                deff = Backbone.Websocket.update(model, request);
                break;
            case "read":
                if( model.id != undefined ){
                    type = 'find';
                    request = Backbone.Websocket.getRequest(model, type, options);
                    deff = Backbone.Websocket.find(model, request)
                }else{
                    type = 'findAll';
                    request = Backbone.Websocket.getRequest(model, type, options);
                    deff = Backbone.Websocket.findAll(model, request)
                }
                break;
        }
        done = function(params){
            options.success(params);
        }
        fail = function(params){
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
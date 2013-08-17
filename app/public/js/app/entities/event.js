define([
    'jquery',
    'backbone',
    'marionette',
    'app/app',

    'app/collections/event/event',
    'app/models/event/event'
], function(jQuery, Backbone, Marionette, App, EventCollection, EventModel){

    var API = {

        getEventById: function(id){

            var deferred = $.Deferred();
            var event = new EventModel();
            event.set("_id", id);

            event.fetch({
                success: function(model, data){
                    deferred.resolve({
                        model: model,
                        data: data
                    })
                },
                error: function(model, xhr){
                    deferred.reject({

                    })
                }
            });

            return deferred.promise();
        },

        saveNewEvent: function( data ){
            var event = new EventModel(data);
            var deferred = $.Deferred();

            event.save(null,{
                success: function(model, data){
                    deferred.resolve({
                        model: new EventModel(data)
                    })
                },
                error: function(model, xhr){
                    deferred.reject({
                        model: event,
                        xhr: xhr
                    })
                }
            });

            return deferred.promise();
        },

        getEvents: function( data ){
            var deferred = $.Deferred();
            this._getUsers( data, deferred );
            return deferred.promise();
        },

        _getEvents: function(data, deferred){
            var ajax = jQuery.ajax({
                type: "GET",
                url: App.config.api.getUsers,
                data: data,
                success: function(data){
                    deferred.resolve(new UserCollection(data))
                },
                error: function(data){
                    deferred.reject({
                        data: data,
                        ajax: ajax
                    })
                }
            })
        }
    }

    /*var event = new EventModel();
    event.set("_id", '520f2888f771fd7d63000002');
    event.fetch();*/

    App.reqres.setHandler('event:getById', function(id){
        return API.getEventById( id );
    })

    App.reqres.setHandler('event:saveNewEvent', function( data ){
        return API.saveNewEvent( data );
    })

    App.reqres.setHandler('event:getEvents', function( data ){
        return API.getUsers( data );
    })

})
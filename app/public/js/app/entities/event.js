define([
    'jquery',
    'backbone',
    'marionette',
    'app/app',

    'app/collections/event/event',
    'app/models/event/event',

    'app/collections/event/eventToShow',
    'app/models/event/eventToShow'

], function(jQuery, Backbone, Marionette, App, EventCollection, EventModel, EventToShowCollection, EventToShowModel){

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

        getEventsToShow: function( data ){
            var deferred = $.Deferred();
            this._getEventsToShow(data, deferred);
            return deferred.promise();
        },

        _getEventsToShow: function(data, deferred){

            var eventToShowCollection = new EventToShowCollection();

            eventToShowCollection.fetch({
                type: "POST",
                data: data,
                success: function(){
                    deferred.resolve({
                        eventToShowCollection: eventToShowCollection
                    });
                },
                error: function(){
                    deferred.resolve({});
                }
            });
        }
    }


    App.reqres.setHandler('event:getById', function(id){
        return API.getEventById( id );
    })

    App.reqres.setHandler('event:saveNewEvent', function( data ){
        return API.saveNewEvent( data );
    })

    App.reqres.setHandler('event:getEventsToShow', function( data ){
        return API.getEventsToShow( data );
    })

})
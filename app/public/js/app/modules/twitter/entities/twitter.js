define([
    'jquery',
    'backbone',
    'marionette',
    'app/app',

    /*collections*/
    "../collection/stream",

    /*models*/
    "../models/stream"

], function(jQuery, Backbone, Marionette, App, StreamCollection, StreamModel){

    var API = {

        saveNewStream: function( data ){

            var stream = new StreamModel(data);
            var deferred = $.Deferred();

            stream.save(null,{
                success: function(model, data){
                    deferred.resolve({
                        model: new StreamModel(data)
                    })
                },
                error: function(model, xhr){
                    deferred.reject({
                        model: stream,
                        xhr: xhr
                    })
                }
            });

            return deferred.promise();
        },

        //------------------------------------------------------

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


    App.reqres.setHandler('twitter:saveNewStream', function(){
        return API.saveNewStream();
    })

    /*App.reqres.setHandler('task:getTasks', function( data ){
        return API.getTasks( data );
    })*/

    /*App.reqres.setHandler('event:getEventsToShow', function( data ){
     return API.getEventsToShow( data );
     })*/

})
define([
    'jquery',
    'backbone',
    'marionette',
    'app/app',

    /*collections*/
    "../collection/stream",

    /*models*/
    "../models/stream",

    /*libs*/
    'async'

], function(jQuery, Backbone, Marionette, App, StreamCollection, StreamModel, async){

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

        getStreams: function(){
            var deferred = $.Deferred();

            var streamCollection = new StreamCollection();

            streamCollection.fetch({
                type: "POST",
                success: function(){
                    deferred.resolve({
                        streamCollection: streamCollection
                    });
                },
                error: function(){
                    deferred.resolve({});
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


    App.reqres.setHandler('twitter:saveNewStream', function(data){
        return API.saveNewStream(data);
    })

    App.reqres.setHandler('twitter:getStreams', function(data){
        return API.getStreams(data);
    })

    /*App.reqres.setHandler('task:getTasks', function( data ){
        return API.getTasks( data );
    })*/

    /*App.reqres.setHandler('event:getEventsToShow', function( data ){
     return API.getEventsToShow( data );
     })*/

})
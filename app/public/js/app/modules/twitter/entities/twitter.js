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

        addListener: function(){
            var deferred = $.Deferred();

            return deferred.promise();
        }
    }

    App.reqres.setHandler('twitter:saveNewStream', function(data){
        return API.saveNewStream(data);
    })

    App.reqres.setHandler('twitter:getStreams', function(){
        return API.getStreams();
    })

    App.reqres.setHandler('twitter:addListener', function(){
        return API.addListener();
    })

    /*App.reqres.setHandler('task:getTasks', function( data ){
        return API.getTasks( data );
    })*/

    /*App.reqres.setHandler('event:getEventsToShow', function( data ){
     return API.getEventsToShow( data );
     })*/

})
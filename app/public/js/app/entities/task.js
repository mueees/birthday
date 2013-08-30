define([
    'jquery',
    'backbone',
    'marionette',
    'app/app',

    /*collections*/
    'app/collections/task/list',
    'app/collections/task/task',

    /*models*/
    'app/models/task/list',
    'app/models/task/task'

], function(jQuery, Backbone, Marionette, App, ListCollection, TaskCollection, ListModel, TaskModel){

    var API = {

        getLists: function(){
            var deferred = $.Deferred();
            this._getLists(deferred);
            return deferred.promise();
        },
        _getLists: function(deferred){
            var listCollection = new ListCollection();
            listCollection.fetch({
                type: "GET",
                success: function(){
                    deferred.resolve({
                        listCollection: listCollection
                    });
                },
                error: function(){
                    deferred.reject({});
                },
                timeout: App.config.opts.timeout
            })
        },

        getTasks: function(data){
            var deferred = $.Deferred();
            this._getTasks(data, deferred);
            return deferred.promise();
        },

        _getTasks: function(data, deferred){
            var taskCollection = new TaskCollection();

            taskCollection.fetch({
                type: "GET",
                data: data,
                success: function(){
                    deferred.resolve({
                        taskCollection: taskCollection
                    });
                },
                error: function(){
                    deferred.reject({});
                }
            });
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


    App.reqres.setHandler('task:getLists', function(){
        return API.getLists();
    })

    App.reqres.setHandler('task:getTasks', function( data ){
        return API.getTasks( data );
    })

    /*App.reqres.setHandler('event:getEventsToShow', function( data ){
        return API.getEventsToShow( data );
    })*/

})
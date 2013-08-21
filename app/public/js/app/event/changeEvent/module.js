define([
    'app/app',
    'marionette',

    'app/views/event/changeEvent/changeEventView'
], function(App, Marionette, ChangeEventView){

    App.module("Event.ChangeEvent", {

        startWithParent: true,

        define: function(ChangeEvent, App, Backbone, Marionette, $, _){

            var Controller = {
                changeEvent: function( id ){
                    if(!id) return false;

                    var done = _.bind(this.renderChangeView, this)
                    var error = _.bind(this.errorRequestEvent, this)

                    $.when( App.request('event:getById', id)).fail( error ).done( done );
                },

                renderChangeView: function(data, deferred){

                    var model = data.model;

                    var view = new ChangeEventView({
                        model: model
                    });

                    ChangeEvent.listenTo(view, "changeEvent", Controller.changeEvent);
                    ChangeEvent.listenTo(view, "removeEvent", Controller.removeEvent);

                    deferred.resolve(view);
                },

                errorRequestEvent:function(){
                    console.log('WTF!');
                },

                getChangeEvent: function( deferred, data ){
                    if( !data.idEvent ){
                        deferred.reject({});
                        return false;
                    }

                    var done = _.bind(this.renderChangeView, this)
                    var error = _.bind(this.errorRequestEvent, this)

                    $.when( App.request( 'event:getById', data.idEvent )).fail( error ).done(function(data){
                        done( data, deferred )
                    });
                },

                changeEvent: function(data){
                    var model = data.model;
                    model.set( data.data );

                    model.save({}, {
                        success: Controller.changeEventSuccess,
                        error: Controller.changeEventError
                    });
                },

                changeEventSuccess:function(model, data, options){
                    ChangeEvent.trigger("eventUpdated");
                },

                changeEventError: function(model, response, options){
                    debugger
                },

                removeEvent: function( data ){
                    var model = data.model;

                    model.on("destroy", function(){debugger});

                    model.destroy({
                        success: function(){
                            Controller.removeEventSuccess();
                        },
                        error:function(){
                            Controller.removeEventError();
                        }
                    })

                },

                removeEventSuccess: function(){
                    ChangeEvent.trigger("eventRemove");
                },

                removeEventError: function(){
                    console.log("WTF!")
                }
            }

            var API = {
                getChangeEvent: function( data ){
                    var deferred = new $.Deferred();
                    Controller.getChangeEvent( deferred, data );
                    return deferred.promise();
                }
            }

            ChangeEvent.API = API;

        }
    })

})
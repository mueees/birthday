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

                    //var changeEventView = new ChangeEventView();
                },

                renderChangeView: function(data, deferred){


                    var model = data.model;

                    var view = new ChangeEventView({
                        model: model
                    })

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
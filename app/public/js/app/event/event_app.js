define([
    'jquery',
    'backbone',
    'marionette',
    'app/app',

    /*sub app*/
    './addEvent/module',
    './showEvent/module'
], function(jQuery, Backbone, Marionette, App){

    App.module("Event", {
        startWithParent: false,

        define: function( Event, App, Backbone, Marionette, $, _ ){

            var Router = Marionette.AppRouter.extend({

                before: function(){
                    App.startSubApp( "Event", {} );
                },

                appRoutes: {
                    "event/add": "addEvent",
                    "events(/:tab)": "showEvents"
                }

            })

            var Controller = {
                addEvent: function(){
                    Event.AddEvent.API.addEvent();
                },
                showEvents: function( tab ){
                    Event.ShowEvent.API.showEvents( tab )
                }
            }

            var API  = {
                addEvent: Controller.addEvent,
                showEvents: Controller.showEvents
            }

            App.addInitializer(function(){
                new Router({
                    controller: API
                })
            })


        }
    })


})
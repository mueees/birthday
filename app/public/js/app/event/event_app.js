define([
    'jquery',
    'backbone',
    'marionette',
    'app/app',

    /*sub app*/
    './addEvent/module'
], function(jQuery, Backbone, Marionette, App){

    App.module("Event", {
        startWithParent: false,

        define: function( Event, App, Backbone, Marionette, $, _ ){



            var Router = Marionette.AppRouter.extend({

                before: function(){
                    App.startSubApp( "Event", {} );
                },

                appRoutes: {
                    "event/add": "addEvent"
                }

            })

            var Controller = {
                addEvent: function(){
                    Event.AddEvent.API.addEvent();
                }
            }

            var API  = {
                addEvent: Controller.addEvent
            }




            App.addInitializer(function(){
                new Router({
                    controller: API
                })
            })


        }
    })


})
define([
    'app/app',
    'marionette'
], function(App, Marionette){


    App.module("Event.AddEvent", {

        startWithParent: true,

        define: function(AddEvent, App, Backbone, Marionette, $, _){

            var Controller = {
                addEvent: function(){

                }
            }

            var API = {
                addEvent: Controller.addEvent
            }

            AddEvent.API = API;

        }
    })

})
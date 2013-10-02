define([
    'jquery',
    'backbone',
    'marionette',
    'app/app'
], function(jQuery, Backbone, Marionette, App){

    App.module("Websocket", {
        startWithParent: false,

        define: function( Websocket, App, Backbone, Marionette, $, _ ){


            var Controller = {
                addEvent: function(){

                }
            }

            var API  = {
                addEvent: Controller.addEvent
            }

            App.addInitializer(function(){

            })

        }
    })


})
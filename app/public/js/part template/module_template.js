define([
    'app/app',
    'marionette',

    /*modules*/
    'app/modules/notify/module'


], function(App, Marionette){


    App.module("Event.AddEvent", {

        startWithParent: true,

        define: function(AddEvent, App, Backbone, Marionette, $, _){

            /*modules*/
            var Notify = App.module("Notify");
            /*Notify.API.showNotify({text: "Preset changed"});*/

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
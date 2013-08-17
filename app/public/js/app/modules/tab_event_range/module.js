define([
    'app/app',
    'marionette',

    'app/views/modules/tab_event_range/tab'
], function(App, Marionette, TabView){


    App.module("TabEvents", {

        startWithParent: true,

        define: function(TabEvents, App, Backbone, Marionette, $, _){

            var Controller = {
                getTabView: function(){
                    return new TabView();
                }
            }

            var API = {
                getTabView: function(){
                    return Controller.getTabView();
                }
            }

            TabEvents.API = API;

        }
    })

})
define([
    'app/app',
    'marionette'
], function(App, Marionette){


    App.module("Event.ShowEvent", {

        startWithParent: true,

        define: function(ShowEvent, App, Backbone, Marionette, $, _){


            var defaults = {
                defaultTab: "Agenda",
                tabs: ['agenda']
            }


            var Controller = {
                showEvents: function( tab ){
                    tab = Controller.determineTab(tab);
                },

                determineTab: function(tab){
                    if( tab ){

                        tab = tab.toLowerCase();

                        if( $.inArray(tab, defaults.tabs) == -1){
                            return defaults.defaultTab;
                        }else{
                            return tab;
                        }

                    }else{
                        return defaults.defaultTab;
                    }

                }
            }

            var API = {
                showEvents: Controller.showEvents
            }

            ShowEvent.API = API;

        }
    })

})
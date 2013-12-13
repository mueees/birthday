define([
    'app/app',
    'marionette',

    /*layout*/
    './layouts/Layout'


], function(App, Marionette, Layout){


    App.module("Monitoring", {

        startWithParent: true,

        define: function(Monitoring, App, Backbone, Marionette, $, _){

            /*modules*/
            var Notify = App.module("Notify");
            /*Notify.API.showNotify({text: "Preset changed"});*/


            var Router = Marionette.AppRouter.extend({

                before: function(){
                    App.startSubApp( "Monitoring", {} );
                },

                appRoutes: {
                    "monitor": "main",
                    "monitor/traffic": "showStream",
                    "monitor/stress/:id": "showStressTest" // this saved stress testing
                }

            });

            var Controller = {
                main: function(){
                    layout = new Layout();
                    layout.render();
                    App.main.show(layout);

                    //show main tab
                    Monitoring.Tab.Controller.showTab(layout);
                },

                showMonitor: function(idMonitor){},

                showStressTest: function(idStressTesting){}
            }

            var API  = {
                main: function(){
                    Controller.main();
                },

                showMonitor: function(idMonitor){
                    Controller.showMonitor(idCategory);
                },

                showStressTest: function(idStressTesting){
                    Controller.showStressTest(idFeed);
                }
            }

            Monitoring.API = API;

            App.addInitializer(function(){
                new Router({
                    controller: API
                })
            })

        }
    })

})
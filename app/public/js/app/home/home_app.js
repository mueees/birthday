define([
    'jquery',
    'backbone',
    'marionette',
    'app/app',

    /*views*/
    'app/views/home/HomeView'
], function(jQuery, Backbone, Marionette, App, HomeView){

    App.module("Home", {
        startWithParent: false,

        define: function( Home, App, Backbone, Marionette, $, _ ){



            var Router = Marionette.AppRouter.extend({

                before: function(){
                    App.startSubApp( "Event", {} );
                },

                appRoutes: {
                    "": "showHomePage"
                }

            })

            var Controller = {
                showHomePage: function(){
                    var homeView = new HomeView();
                    App.main.show(homeView);
                }
            }

            var API  = {
                showHomePage: Controller.showHomePage
            }

            App.addInitializer(function(){
                new Router({
                    controller: API
                })
            })

            Home.API = API;


        }
    })


})
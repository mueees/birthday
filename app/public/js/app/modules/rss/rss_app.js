define([
    'jquery',
    'backbone',
    'marionette',
    'app/app',

    /*layout*/
    './layouts/layout',

    /*modules*/
    './modules/menu/menu_controller',

    /*entites*/
    './entities/rss'
], function(jQuery, Backbone, Marionette, App, Layout){

    App.module("Rss", {
        startWithParent: false,

        define: function( Rss, App, Backbone, Marionette, $, _ ){

            var Router = Marionette.AppRouter.extend({

                before: function(){
                    App.startSubApp( "Rss", {} );
                },

                appRoutes: {
                    "rss": "main",
                    "rss(/category/:id)": "showCategory",
                    "rss(/:feed)": "showFeed",
                }

            })

            var Controller = {
                main: function(){
                    var layout = new Layout();
                    layout.render();
                    App.main.show(layout);

                    Rss.Menu.Controller.showMenu(layout);
                },

                showCategory: function(){
                    console.log('showCategory');
                },

                showFeed: function(){
                    console.log('showFeed');
                }
            }

            var API  = {
                main: function(){
                    Controller.main();
                },

                showCategory: function(idCategory){
                    Controller.showCategory(idCategory);
                },

                showFeed: function(idFeed){
                    Controller.showFeed(idFeed);
                }
            }

            App.addInitializer(function(){
                new Router({
                    controller: API
                })
            })

        }
    })


})
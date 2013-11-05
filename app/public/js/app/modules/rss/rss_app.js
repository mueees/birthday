define([
    'jquery',
    'backbone',
    'marionette',
    'app/app',

    /*layout*/
    './layouts/layout',

    /*modules*/
    './modules/menu/menu_controller',
    './modules/Personalize/module',
    './modules/ShowFeed/module',
    './modules/SaveNewFeed/module',

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
                    "rss(/:feed)": "showFeed"
                }

            });

            var layout;

            var Controller = {
                main: function(){
                    layout = new Layout();
                    layout.render();
                    App.main.show(layout);
                    
                    this.subscribe();

                    Rss.Menu.Controller.showMenu(layout);
                },

                subscribe: function(){
                    App.channels.rss.on('personalize', this.showPersonalize);
                    App.channels.rss.on('availableFeedSelected', this.showAvailableFeed);
                    App.channels.rss.on('saveNewFeed', this.showSaveFeedDialog);
                },

                showAvailableFeed: function(feed){
                    Rss.ShowFeed.Controller.show(layout, feed);
                },

                showPersonalize: function(){
                    Rss.Personalize.Controller.show(layout);
                },

                showSaveFeedDialog: function(feed){
                    Rss.SaveNewFeed.Controller.show(feed);
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
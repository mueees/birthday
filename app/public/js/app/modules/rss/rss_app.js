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
                    App.channels.rss.on('showSavedPost', this.showSavedPost);
                    App.channels.rss.on('availableFeedSelected', this.showAvailableFeed);
                    App.channels.rss.on('saveNewFeed', this.showSaveFeedDialog);
                    App.channels.rss.on('showFeed', this.showFeed);
                    App.channels.rss.on('showSavedFeed', this.showSavedFeed)
                },

                unsubscribe: function(){
                    App.channels.rss.off();
                },

                showFeed: function(data){
                    Rss.ShowFeed.Controller.showFeed(layout, data);
                },

                showAvailableFeed: function(feed){
                    Rss.ShowFeed.Controller.showAvailableFeed(layout, feed);
                },

                showPersonalize: function(){
                    Rss.Personalize.Controller.show(layout);
                },

                showSaveFeedDialog: function(feed){
                    Rss.SaveNewFeed.Controller.show(feed);
                },

                showSavedPost: function(){
                    Rss.ShowFeed.Controller.showSavedPost(layout);
                },

                showSavedFeed: function(data){
                    Rss.ShowFeed.Controller.showSavedFeed(layout, data);
                },

                showCategory: function(){
                    console.log('showCategory');
                }
            }

            Rss.on("stop", function(options){
                Controller.unsubscribe();
            });

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
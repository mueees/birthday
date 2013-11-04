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

    /*entites*/
    './entities/rss'
], function(jQuery, Backbone, Marionette, App, Layout){

    App.module("Rss", {
        startWithParent: false,

        define: function( Rss, App, Backbone, Marionette, $, _ ){

/*
            var category = new CategoryModel({
                _id: 12e11
            });
            category = {
                _id: "sdsgdfg2234"б
                name: "web category",
                feeds: new FeedColl()
            }
            category.fetch();

            var feed = new Feed({
                _id: "132"
            });

            var feed = {
                _id: "132",
                name: "seper feeed",
                posts: null,
                unread: 5 
            }
            feed.fetch();

            // все что связано с постами будет проксировать к Post модели
            feed.getAllPosts();
            feed.getPost(idPost);*/

            var Router = Marionette.AppRouter.extend({

                before: function(){
                    App.startSubApp( "Rss", {} );
                },

                appRoutes: {
                    "rss": "main",
                    "rss(/category/:id)": "showCategory",
                    "rss(/:feed)": "showFeed",
                }

            });

            var layout;

            var Controller = {
                main: function(){
                    layout = new Layout();
                    layout.render();
                    App.main.show(layout);
                    
                    this.subscribe(layout);

                    Rss.Menu.Controller.showMenu(layout);
                },

                subscribe: function(){
                    App.channels.rss.on('personalize', this.showPersonalize);
                },

                showPersonalize: function(){
                    Rss.Personalize.Controller.show(layout);
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
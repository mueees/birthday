define([
    'app/app',
    'marionette',

    /*view*/
    './views/FeedView'

], function(App, Marionette, FeedView){


    App.module("Rss.ShowFeed", {

        startWithParent: true,

        define: function(ShowFeed, App, Backbone, Marionette, $, _){

            /*modules*/
            var Notify = App.module("Notify");
            

            var Controller = {
                showAvailableFeed: function( layout, feed ){
                    var feedView = new FeedView({model: feed});
                    layout.main_rss.show(feedView)
                },

                showFeed: function( layout, data ){

                    $.when( App.request('rss:getFeed', data)).fail(function(){
                        Notify.API.showNotify({text: "Cannot download feed info"});
                    }).done(function(data){

                        var feed = data.model;

                        feed.getMore({
                            success: function(){
                                var feedView = new FeedView({model: data.model});
                                layout.main_rss.show(feedView);
                            },
                            error: function(collection, err){
                                Notify.API.showNotify({text: err.message});
                            }
                        })

                            setInterval(function(){
                                feed.getMore({
                                    success: function(){
                                        var feedView = new FeedView({model: data.model});
                                        layout.main_rss.show(feedView);
                                    },
                                    error: function(collection, err){
                                        Notify.API.showNotify({text: err.message});
                                    }
                                })
                            }, 1000)
                        
                    });
                }
            }

            ShowFeed.Controller = Controller;

        }
    })

})
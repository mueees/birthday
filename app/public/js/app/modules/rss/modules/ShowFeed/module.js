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
            /*Notify.API.showNotify({text: "Preset changed"});*/

            var Controller = {
                show: function( layout, feed ){
                    var feedView = new FeedView({model: feed});
                    layout.main_rss.show(feedView)
                }
            }

            ShowFeed.Controller = Controller;

        }
    })

})
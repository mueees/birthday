define([
    'app/app',
    'marionette',

    /*collections*/
    '../../collections/categories',

    /*views*/
    './views/SaveNewFeedView'

], function(App, Marionette, Categories, SaveNewFeedView){


    App.module("Rss.SaveNewFeed", {

        startWithParent: true,

        define: function(SaveNewFeed, App, Backbone, Marionette, $, _){

            /*modules*/
            var Notify = App.module("Notify");
            /*Notify.API.showNotify({text: "Preset changed"});*/

            var Controller = {
                show: function( feed ){

                    //get all categories
                    var categories = new Categories();
                    categories.fetch().done(function(categories){

                        var saveNewFeedView = new SaveNewFeedView({
                            categories: categories,
                            feed: feed
                        })

                        $('body').append(saveNewFeedView.$el);

                    });
                    
                }
            }

            SaveNewFeed.Controller = Controller;

        }
    })

})
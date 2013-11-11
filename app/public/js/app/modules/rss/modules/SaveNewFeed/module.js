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

            var Controller = {
                show: function( feed ){

                    //get all categories
                    var categories = new Categories();
                    categories.fetch().done(function(){

                        var saveNewFeedView = new SaveNewFeedView({
                            categories: categories,
                            feed: feed
                        })

                        saveNewFeedView.on("text", function(error){
                            Notify.API.showNotify({text: error});
                        })

                        $('body').append(saveNewFeedView.$el);

                    });
                    
                }
            }

            SaveNewFeed.Controller = Controller;

        }
    })

})
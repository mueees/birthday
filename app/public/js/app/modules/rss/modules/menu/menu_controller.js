define([
    'app/app',
    'marionette',

    /*views*/
    './views/TabView',
    './views/AddView',
    './views/Feeds',

    /*collections*/
    '../../collections/categories',

    /*models*/
    './models/AddFeedModel'

], function(App, Marionette, TabView, AddView, FeedsView, Categories, AddFeedModel){


    App.module("Rss.Menu", {

        startWithParent: true,

        define: function(Menu, App, Backbone, Marionette, $, _){

            /*modules*/
            var Notify = App.module("Notify");

            var Controller = {
                showMenu: function( layout ){

                    var feedsTab,
                        addView,
                        addFeedModel,
                        tabView,
                        categories,
                        _this = this;

                    //create add view
                    addFeedModel = new AddFeedModel();
                    addFeedModel.url = function(){return App.config.api.rss.getFeedsByUrl}
                    addFeedModel.on('errorMessage', function(err){
                        Notify.API.showNotify({text: err});
                    })
                    addView = new AddView({
                        model: addFeedModel
                    });
                    addView.on("availableFeedSelected", function(feed){
                        App.channels.rss.trigger( 'availableFeedSelected', feed );
                    })
                    addView.on("saveNewFeed", function(feed){
                        App.channels.rss.trigger( 'saveNewFeed', feed );
                    })

                    //create  all categories
                    categories = new Categories();
                    categories.fetch().done(function(){
                        feedsTab = new FeedsView({collection: categories});
                        layout.contentCont.show(feedsTab);

                        feedsTab.on('personalize', function(){
                            App.channels.rss.trigger( 'personalize', categories );
                        })

                        feedsTab.on('showSavedPost', function(){
                            App.channels.rss.trigger( 'showSavedPost' );
                        })

                        feedsTab.on('showFeed', function(data){
                            App.channels.rss.trigger( 'showFeed', data );
                        })
                    });

                    //create tab view
                    tabView = new TabView();

                    tabView.on('changeTab', function(type){
                        if( type == "content" ){
                            addView.$el.hide();
                            feedsTab.$el.show();
                        }else if( type == "add" ){
                            addView.$el.show();
                            feedsTab.$el.hide();
                        }else{
                            addView.$el.hide();
                            feedsTab.$el.show();
                        }
                        return false;
                    })


                    layout.tabCont.show(tabView);
                    layout.addCont.show(addView);
                    
                }
            }

            Menu.Controller = Controller;

        }
    })

})
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
                    addFeedModel.url = App.config.api.rss.getFeedsByUrl;
                    addFeedModel.on('errorMessage', function(err){
                        Notify.API.showNotify({text: err});
                    })
                    addView = new AddView({
                        model: addFeedModel
                    });
                    addView.on("availableFeedSelected", function(feed){
                        App.channels.rss.trigger( 'availableFeedSelected', feed );
                    })

                    //create  all categories
                    categories = new Categories();
                    categories.fetch().done(function(categories){
                        feedsTab = new FeedsView({collection: categories});
                        layout.contentCont.show(feedsTab);

                        feedsTab.on('personalize', function(){
                            App.channels.rss.trigger( 'personalize', categories );
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

var model = {
    categories: [
        {
            _id: '123df',
            name: "web",
            feeds: [{
                id: "some id",
                name: "name feed",
                unread: 5
            }]
        },
        {
            _id: 'dfgdg',
            name: "web2",
            feeds: [
                {
                    id: "some id",
                    name: "name feed",
                    unread: 5
                },
                {
                    id: "some id",
                    name: "name feed",
                    unread: 2
                }]
        }
    ]
}
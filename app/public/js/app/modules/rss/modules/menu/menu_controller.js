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
            /*Notify.API.showNotify({text: "Preset changed"});*/

            var Controller = {
                showMenu: function( layout ){
                    //create tab view
                    var tabView = new TabView();

                    //create add view
                    var addFeedModel = new AddFeedModel();
                    addFeedModel.on('change:feed_url', function(){
                        debugger
                    })
                    var addView = new AddView({
                        model: addFeedModel
                    });

                    //create  all categories
                    var categories = new Categories();
                    categories.fetch().done(function(categories){
                        var feedsTab = new FeedsView({collection: categories});
                        layout.contentCont.show(feedsTab);

                        feedsTab.on('personalize', function(){
                            App.channels.rss.trigger( 'personalize', categories );
                        })
                    });


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
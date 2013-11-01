define([
    'app/app',
    'marionette',

    /*views*/
    './views/TabView',
    './views/AddView'

], function(App, Marionette, TabView, AddView){


    App.module("Rss.Menu", {

        startWithParent: true,

        define: function(Menu, App, Backbone, Marionette, $, _){

            /*modules*/
            var Notify = App.module("Notify");
            /*Notify.API.showNotify({text: "Preset changed"});*/

            var Controller = {
                showMenu: function( layout ){
                    var tabView = new TabView();
                    var addView = new AddView();

                    var Post = Backbone.RelationalModel.extend({
                        urlRoot: '/api/posts'
                    });

                    var PostCollection  = Backbone.Collection.extend({
                        model: Post
                    });

                    var Feed = Backbone.RelationalModel.extend({
                        relations: [{
                            type: Backbone.HasMany,
                            key: 'posts',
                            relatedModel: 'Post',
                            collectionType: 'PostCollection',
                            includeInJSON: true
                        }]
                    })

                    var feed = new Feed({
                        name: 'News',
                        posts: [
                            {
                                "title": "test"
                            },
                            {
                                "title": "test2"
                            }
                        ]
                    });
                    /*var post = new Post({
                        title: "this is test post"
                    });*/

                    //getCategories
                    /*var request = {
                        method: App.config.api.twitter.subscribe,
                        params: {}
                    }*/
                    //$.when( App.request('rss:getCategories') ).fail(function(){debugger}).done(function(){debugger});

                    //$.when( App.request('rss:getCategory', {_id: 23}) ).fail(function(){debugger}).done(function(){debugger});

                    //var contentView = new ContentView();

                    //App.request('rss:getPost', {_id: "123123"});
                    //App.request('rss:getPosts');


                    //$.when( App.request('websocket:send', request) ).fail(fail).done(done);


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
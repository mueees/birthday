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
                    //var contentView = new ContentView();

                    //App.request('rss:getPost', {_id: "123123"});
                    App.request('rss:getPosts');
                    

                    //$.when( App.request('websocket:send', request) ).fail(fail).done(done);


                    layout.tabCont.show(tabView);
                    layout.addCont.show(addView);
                }
            }

            Menu.Controller = Controller;

        }
    })

})



var modelData = {
    category: {
        _id: '123df',
        name: "web",
        feeds: [{
                id: "sdfsdf",
                name: "sdfgdgh",
                unread: 5
        }]
    }
}
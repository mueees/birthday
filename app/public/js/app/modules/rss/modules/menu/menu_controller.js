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

                    layout.tabCont.show(tabView);
                    layout.addCont.show(addView);
                }
            }

            Menu.Controller = Controller;

        }
    })

})
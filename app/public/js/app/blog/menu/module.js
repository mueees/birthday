define([
    'app/app',
    'marionette',

    /*views*/
    'app/views/blog/menu/menu'
], function(App, Marionette, MenuView){


    App.module("Blog.Menu", {

        startWithParent: true,

        define: function(Menu, App, Backbone, Marionette, $, _){

            /*modules*/
            var Blog = App.module("Blog");

            var Controller = {
                showMenu: function( region ){
                    var menu = this.getMenuView();
                    Menu.listenTo(menu, "changeMenu", function(data){ App.channels.blog.trigger("changeMenu:" + data.eventName, data) });

                    region.show(menu);
                },

                getMenuView: function(){
                    return new MenuView();
                }
            }

            var API = {
                showMenu: function(region){Controller.showMenu(region)}
            }

            Menu.API = API;

        }
    })

})
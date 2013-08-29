define([
    'app/app',
    'marionette',

    /*views*/
    'app/views/task/Menu/menu'
], function(App, Marionette, MenuView){


    App.module("Task.Menu", {

        startWithParent: true,

        define: function(Menu, App, Backbone, Marionette, $, _){

            var Task = App.module('Task');

            var Controller = {
                showMenu: function( options ){
                    var menu = new MenuView();
                    options.region.show(menu)
                }
            }

            var API = {
                showMenu: Controller.showMenu
            }

            Menu.API = API;

        }
    })

})
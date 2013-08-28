define([
    'app/app',
    'marionette'
], function(App, Marionette){


    App.module("Task.Menu", {

        startWithParent: true,

        define: function(Menu, App, Backbone, Marionette, $, _){


            var Task = App.module('Task');

            var Controller = {
                showMenu: function( options ){

                }
            }

            var API = {
                showMenu: Controller.showMenu
            }

            Menu.API = API;

        }
    })

})
define([
    'jquery',
    'backbone',
    'marionette',
    'app/app',

    /*views*/
    "app/views/menu/MenuView"
], function(jQuery, Backbone, Marionette, App, MenuView){

    App.module("Menu", {
        startWithParent: false,

        define: function( Menu, App, Backbone, Marionette, $, _ ){

            var Controller = {
                init: function(){
                    var _this = this;

                    var menuView = new MenuView({
                        channel: App.channels.main,
                        region: App.mainMenu,
                        state: App.request('user:islogin')
                    });
                }
            }

            App.addInitializer(function(){
                Controller.init();
            })


        }
    })


})
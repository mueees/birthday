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

                    var done = _.bind(this.getListsSuccess, this);
                    var error = _.bind(this.getListsError, this);

                    $.when( App.request('task:getLists')).fail( error ).done(function(data){
                        done( data, options );
                    });

                },

                getListsSuccess: function( data, options ){

                    var menu = new MenuView( data );
                    options.region.show(menu);
                },

                getListsError: function(){
                    console.log("WTF!");
                }
            }

            var API = {
                showMenu: function(options){Controller.showMenu(options)}
            }

            Menu.API = API;

        }
    })

})
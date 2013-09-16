define([
    'jquery',
    'backbone',
    'marionette',
    'app/app',

    /*layouts*/
    'app//layouts/fileBrowser/layout'
], function(jQuery, Backbone, Marionette, App, FileBrowserLayout){

    App.module("FileBrowser", {
        startWithParent: false,

        define: function( FileBrowser, App, Backbone, Marionette, $, _ ){



            var Router = Marionette.AppRouter.extend({

                before: function(){
                    App.startSubApp( "Event", {} );
                },

                appRoutes: {
                    "": "showFileBrowser"
                }

            })

            var Controller = {
                showFileBrowser: function(){
                    var layout = new FileBrowserLayout();


                }
            }

            var API  = {
                showFileBrowser: Controller.showFileBrowser
            }


            App.addInitializer(function(){
                new Router({
                    controller: API
                })
            })


        }
    })


})
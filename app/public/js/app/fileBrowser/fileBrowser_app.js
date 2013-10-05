define([
    'jquery',
    'backbone',
    'marionette',
    'app/app',

    './FileBrowserInstance/FileBrowserInstance',

    /*layouts*/
    'app/layouts/fileBrowser/layout',

    /*views*/
    'app/views/fileBrowser/PathView',
    'app/views/fileBrowser/ExplorerView',
    'app/views/fileBrowser/ManageBtnView',
    'app/views/fileBrowser/UploadView',

    /*collections*/
    'app/collections/fileBrowser/ItemsCollect'

], function(jQuery, Backbone, Marionette, App, FileBrowserInstance, FileBrowserLayout, PathView, ExplorerView, ManageBtnView, UploadView, ItemsCollect){

    App.module("FileBrowser", {
        startWithParent: false,

        define: function( FileBrowser, App, Backbone, Marionette, $, _ ){

            var Router = Marionette.AppRouter.extend({

                before: function(){
                    if(!Controller.determineAccess()){
                        return false;
                    }
                    App.startSubApp( "FileBrowser", {} );
                },

                appRoutes: {
                    /*"" : "fileBrowserWindow",*/
                    "fileBrowser" : "fileBrowserWindow"
                }

            })

            var Controller = {

                determineAccess: function(){
                    var state = App.request('user:islogin');
                    if(!state){
                        Backbone.history.navigate("/");
                        App.channels.main.trigger("accessDenied");
                        return false;
                    }else{
                        return true;
                    }
                },

                getFileBrowser: function(){
                    return new FileBrowserInstance({
                        path: App.config.api.defaultPath,
                        urls: {
                            defaultPath: App.config.api.defaultPath,
                            downloadItems: App.config.api.downloadItems,
                            fileBrowser: App.config.api.fileBrowser,
                            newFolder: App.config.api.newFolder,
                            deleteItems: App.config.api.deleteItems
                        }
                    });
                },

                fileBrowserWindow: function(){
                    var fileBrowserInstance = this.getFileBrowser();
                    App.main.show(fileBrowserInstance.layout);
                }


            }

            var API  = {
                getFileBrowser: function(){
                    return Controller.getFileBrowser();
                },

                fileBrowserWindow: function(){Controller.fileBrowserWindow()}
            }

            FileBrowser.API = API;

            App.addInitializer(function(){
                new Router({
                    controller: API
                })
            })

        }
    })


})
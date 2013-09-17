define([
    'jquery',
    'backbone',
    'marionette',
    'app/app',

    /*layouts*/
    'app//layouts/fileBrowser/layout',

    /*views*/
    'app/views/fileBrowser/PathView',
    'app/views/fileBrowser/ExplorerView',
    'app/views/fileBrowser/ManageBtnView',

    /*collections*/
    'app/collections/fileBrowser/ItemsCollect',

    /*modules*/
    'app/modules/notify/module'

], function(jQuery, Backbone, Marionette, App, FileBrowserLayout, PathView, ExplorerView, ManageBtnView, ItemsCollect){

    App.module("FileBrowser", {
        startWithParent: false,

        define: function( FileBrowser, App, Backbone, Marionette, $, _ ){

            /*modules*/
            var Notify = App.module("Notify");

            var opts = {
                defaultPath: "/",
                url: "api/fileBrowser"
            }

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



                    var pathView = new PathView({
                        channel: App.channels.fileBrowser
                    });
                    var explorerView = new ExplorerView({
                        collection: new ItemsCollect(),
                        channel: App.channels.fileBrowser
                    });
                    var manageBtnView = new ManageBtnView({
                        channel: App.channels.fileBrowser
                    });

                    layout.render();

                    App.main.show(layout);
                    layout.explore.show(explorerView);
                    layout.path.show(pathView);
                    layout.manageBtn.show(manageBtnView);

                    this.getContent({path: opts.defaultPath});

                },

                getContent: function(path){

                    $.ajax({
                        type: "GET",
                        data: path,
                        url: opts.url,
                        success: function(data){
                            App.channel.fileBrowser.trigger("setNewPath", {
                                data: data,
                                path: path
                            });
                        },
                        error: function(){
                            Notify.API.showNotify({text: "Cannot download folder data. Try again."});
                        }
                    })

                },

                createFolder: function(){

                }
            }

            var API  = {
                showFileBrowser: function(){Controller.showFileBrowser()}
            }


            App.addInitializer(function(){
                new Router({
                    controller: API
                })
            })

        }
    })


})
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
    'app/views/fileBrowser/UploadView',

    /*collections*/
    'app/collections/fileBrowser/ItemsCollect',

    /*modules*/
    'app/modules/notify/module'

], function(jQuery, Backbone, Marionette, App, FileBrowserLayout, PathView, ExplorerView, ManageBtnView, UploadView, ItemsCollect){

    App.module("FileBrowser", {
        startWithParent: false,

        define: function( FileBrowser, App, Backbone, Marionette, $, _ ){

            /*modules*/
            var Notify = App.module("Notify");

            var opts = {
                currentPath: null
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
                        channel: App.channels.fileBrowser,
                        path: App.config.api.defaultPath
                    });
                    var explorerView = new ExplorerView({
                        collection: new ItemsCollect(),
                        channel: App.channels.fileBrowser
                    });
                    var manageBtnView = new ManageBtnView({
                        channel: App.channels.fileBrowser
                    });
                    var uploadView = new UploadView({
                        channel: App.channels.fileBrowser,
                        path: App.config.api.defaultPath
                    });

                    layout.render();

                    App.main.show(layout);
                    layout.explore.show(explorerView);
                    layout.path.show(pathView);
                    layout.upload.show(uploadView);
                    layout.manageBtn.show(manageBtnView);

                    opts.currentPath = App.config.api.defaultPath;
                    this.getContent({path: App.config.api.defaultPath});

                },

                getContent: function(data){

                    $.ajax({
                        type: "GET",
                        data: data,
                        url: App.config.api.fileBrowser,
                        success: function(dataRequest){
                            App.channels.fileBrowser.trigger("setNewPath", {
                                data: dataRequest,
                                path: data.path
                            });
                        },
                        error: function(){
                            Notify.API.showNotify({text: "Cannot download folder data. Try again."});
                        }
                    })

                },

                up: function(){
                    var upPath = this.getUpPath(opts.currentPath);
                    opts.currentPath = upPath;
                    this.getContent({path: opts.currentPath});
                },

                goToPath: function(data){
                    opts.currentPath = data.path;
                    this.getContent({path: opts.currentPath});
                },

                createNewFolder: function(data){

                    $.ajax({
                        type: "GET",
                        data: {dirPath: data.dirPath},
                        url: App.config.api.newFolder,
                        success: function(dataRequest){
                            data.model.trigger("newFolderCreated");
                        },
                        error: function(){
                            data.model.trigger("newFolderDONTCreated");
                            Notify.API.showNotify({text: "Cannot create folder. Try again."});
                        }
                    })
                },

                deleteItem: function(data){
                    var _this = this;

                    $.ajax({
                        type: "DELETE",
                        data: data,
                        url: App.config.api.deleteItems,
                        success: function(dataRequest){
                            _this.getContent({path: opts.currentPath});
                        },
                        error: function(){
                            Notify.API.showNotify({text: "Cannot delete items. Try again."});
                            _this.getContent({path: opts.currentPath});
                        }
                    })
                },

                showMessage: function(data){
                    Notify.API.showNotify(data);
                },

                getUpPath: function(path){
                    var parts = path.split('/');
                    parts = parts.filter(function(val) {
                        if( val ) return val;
                    });

                    parts.pop();

                    if( !parts.length ){
                        return "/";
                    }else{
                        return "/" + parts.join("/") + "/"
                    }

                }
            }

            var API  = {
                showFileBrowser: function(){Controller.showFileBrowser()}
            }

            /*events*/
            App.channels.fileBrowser.on("up", function(){Controller.up()});
            App.channels.fileBrowser.on("deleteItem", function(data){Controller.deleteItem(data)});
            App.channels.fileBrowser.on("showMessage", function(data){Controller.showMessage(data)});
            App.channels.fileBrowser.on("goToPath", function(data){Controller.goToPath(data)});
            App.channels.fileBrowser.on("createNewFolder", function(data){Controller.createNewFolder(data)});


            App.addInitializer(function(){
                new Router({
                    controller: API
                })
            })

        }
    })


})
define([
    'app/app',
    'marionette',

    /*layouts*/
    'app/layouts/fileBrowser/layout',

    /*views*/
    'app/views/fileBrowser/PathView',
    'app/views/fileBrowser/ExplorerView',
    'app/views/fileBrowser/ManageBtnView',
    'app/views/fileBrowser/UploadView',

    /*collections*/
    'app/collections/fileBrowser/ItemsCollect',

    /*modules*/
    'app/modules/notify/module'

], function(App, Marionette, FileBrowserLayout, PathView, ExplorerView, ManageBtnView, UploadView, ItemsCollect){

    var Notify = App.module("Notify");

    function FileBrowser(options){
        this.currentPath = options.path;
        this.urls = options.urls;
        this.init(options);
    }

    _.extend(FileBrowser.prototype, {

        init: function(opts){
            
            var _this = this;
            
            this.channel = _.extend({}, Backbone.Events);
            this.layout = new FileBrowserLayout();

            this.pathView = new PathView({
                path: opts.path,
                channel: this.channel
            });
            this.explorerView = new ExplorerView({
                collection: new ItemsCollect(),
                channel: this.channel
            });
            this.manageBtnView = new ManageBtnView({
                channel: this.channel
            });
            this.uploadView = new UploadView({
                path: opts.path,
                channel: this.channel
            });

            this.layout.on("show", function(){
                _this.layout.explore.show(_this.explorerView);
                _this.layout.path.show(_this.pathView);
                _this.layout.upload.show(_this.uploadView);
                _this.layout.manageBtn.show(_this.manageBtnView);
                _this.getContent({path: _this.currentPath});
                _this.bind();
            });
            
        },

        bind: function(){
            
            var _this = this;
            
            this.channel.on("up", function(){_this.up()});
            this.channel.on("deleteItem", function(data){_this.deleteItem(data)});
            this.channel.on("showMessage", function(data){_this.showMessage(data)});
            this.channel.on("goToPath", function(data){_this.goToPath(data)});
            this.channel.on("selectBtnWithData", function(data){_this.selectBtnWithData(data)});
            this.channel.on("createNewFolder", function(data){_this.createNewFolder(data)});
        },

        getContent: function(data){

            var _this = this;

            $.ajax({
                type: "GET",
                data: data,
                url: this.urls.fileBrowser,
                success: function(dataRequest){
                    _this.channel.trigger("setNewPath", {
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
            var upPath = this.getUpPath(this.currentPath);
            this.currentPath = upPath;
            this.getContent({path: this.currentPath});
        },

        deleteItem: function(data){
            var _this = this;

            $.ajax({
                type: "DELETE",
                data: data,
                url: this.urls.deleteItems,
                success: function(dataRequest){
                    _this.getContent({path: _this.currentPath});
                },
                error: function(){
                    Notify.API.showNotify({text: "Cannot delete items. Try again."});
                    _this.getContent({path: _this.currentPath});
                }
            })
        },

        showMessage: function(data){
            Notify.API.showNotify(data);
        },

        goToPath: function(data){
            this.currentPath = data.path;
            this.getContent({path: this.currentPath});
        },

        selectBtnWithData: function( data ){
            var funcName = this.getUrlParam('CKEditorFuncNum');
            window.opener.CKEDITOR.tools.callFunction(funcName, data.paths[0]);
            window.close()
        },

        createNewFolder: function(data){

            $.ajax({
                type: "GET",
                data: {dirPath: data.dirPath},
                url:  this.urls.newFolder,
                success: function(dataRequest){
                    data.model.trigger("newFolderCreated");
                },
                error: function(){
                    data.model.trigger("newFolderDONTCreated");
                    Notify.API.showNotify({text: "Cannot create folder. Try again."});
                }
            })
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

    });

    return FileBrowser;



})
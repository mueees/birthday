define([
    'marionette',
    'text!app/templates/fileBrowser/ExplorerTableView.html',
    'text!app/templates/fileBrowser/ExplorerIconView.html',
    

    /*views*/
    'app/views/fileBrowser/base/FolderList',
    'app/views/fileBrowser/base/FolderIcon',
    'app/views/fileBrowser/base/FileList',
    'app/views/fileBrowser/base/FileIcon',
    'app/views/fileBrowser/items/FileListImage',
    'app/views/fileBrowser/items/FileIconImage'

], function(Marionette, ExplorerTableView, ExplorerIconView, FolderList, FolderIcon, FileList, FileIcon, FileListImage, FileIconImage ){

    return Marionette.ItemView.extend({

        explorerTableView: _.template(ExplorerTableView),

        explorerIconView: _.template(ExplorerIconView),

        events: {

        },

        images: ['jpg', 'jpeg', 'png', 'bmp'],

        viewMode: 'list',

        ui: {
            "table": "table"
        },

        initialize: function(data){

            _.bind(this.setNewPath, this);
            _.bind(this.newFolderBtn, this);


            this.collection = data.collection;
            this.channel = data.channel;
            this.path = null;

            this.listenTo(this.channel, "setNewPath", this.setNewPath);
            this.listenTo(this.channel, "newFolderBtn", this.newFolderBtn);
            this.listenTo(this.channel, "deleteBtn", this.deleteBtn);
            this.listenTo(this.channel, "selectBtn", this.selectBtn);
            this.listenTo(this.channel, "selectAllBtn", this.selectAllBtn);
            this.listenTo(this.channel, "unSelectAllBtn", this.unSelectAllBtn);
            this.listenTo(this.channel, "downloadBtn", this.downloadBtn);
            this.listenTo(this.channel, "viewModeBtn", this.viewModeBtn);
            this.listenTo(this.collection, "reset", this.render);
            this.listenTo(this.collection, "add", this.addNewItem);

        },

        setNewPath: function(data){
            this.path = data.path;
            this.collection.reset(data.data);
        },

        render: function(){
            if( this.viewMode == "list" ){
                this.renderTable();
            }else if( this.viewMode == "icon" ){
                this.renderIcon();
            }
        },

        renderIcon: function(){
            var _this = this;

            this.$el.html("");
            this.$el.html(this.explorerIconView());

            this.collection.each(function(item){
                var view = _this.getOneItem(item);

                _this.listenTo(view, "inFolderBtn", _this.goToPath);
                _this.listenTo(view, "rename", _this.rename);
                _this.listenTo(view, "isActiveChange", _this.isActiveChange);

                _this.$el.find('ul').append(view.$el);
            });
        },

        renderTable: function(){
            var _this = this;

            this.$el.html("");
            this.$el.html(this.explorerTableView());

            this.collection.each(function(item){
                var view = _this.getOneItem(item);

                _this.listenTo(view, "inFolderBtn", _this.goToPath);
                _this.listenTo(view, "rename", _this.rename);
                _this.listenTo(view, "isActiveChange", _this.isActiveChange);

                _this.$el.find('table tbody').append(view.$el);
            });

            setTimeout(function(){_this.isActiveChange();},0)
        },

        isActiveChange: function(){
            var activeItem =  this.collection.getActiveItem();
            this.channel.trigger("currentItemSelected", {
                items: activeItem
            })
        },

        createNewFolder: function(data){
            var _this = this;
            data.model.set("newPath", _this.path + data.newName);

            this.channel.trigger("createNewFolder", {
                dirPath: _this.path + data.newName,
                model: data.model
            })
        },

        rename: function(data){
            var _this = this;
            this.channel.trigger("rename", {
                dirPath: _this.path + data.model.get("name"),
                newName: data.newName
            })
        },

        goToPath: function(data){
            var _this = this;
            this.channel.trigger("goToPath", {
                path: _this.path + data.model.get("name") + "/"
            });
        },

        getOneItem: function(model){

            var isDirectory = model.get("isDirectory");
            var _this = this;

            if( isDirectory ){
                if( this.viewMode == "list" ){
                    return new FolderList({model:model});
                }else if(this.viewMode == "icon"){
                    return new FolderIcon({model:model});
                }
            }else{
                //this is file
                var isImage = (function(){ return ( $.inArray(model.get('typeFile'), _this.images) != -1) ? true : false; })();

                if( this.viewMode == "list" ){
                    if(isImage) {
                        //this is image
                        return new FileListImage({model:model});
                    }else{
                        //this is unknown file type
                        return new FileList({model:model});
                    }
                }else if( this.viewMode == "icon" ){
                    if(isImage){
                        return new FileIconImage({model:model});
                    }else{
                        return new FileIcon({model:model});
                    }
                }

            }
            return false;
        },

        newFolderBtn: function(){
            this.collection.push({
                isDirectory: true
            });
        },

        deleteBtn: function(){
            var activeItem =  this.collection.getActiveItem();
            var paths = [];
            _.each(activeItem, function(item){
                paths.push(item.get('path'));
            });

            this.channel.trigger("deleteItem", {
                paths: paths
            });
        },

        selectBtn: function(){
            var activeItem =  this.collection.getActiveItem();
            var paths = [];
            _.each(activeItem, function(item){
                paths.push(item.get('path'));
            });

            this.channel.trigger("selectBtnWithData", {paths:paths});
        },

        selectAllBtn: function(){
            this.collection.each(function(model){
                model.set("isActive", true);
            })
        },

        unSelectAllBtn: function(){
            this.collection.each(function(model){
                model.set("isActive", false);
            })
        },

        downloadBtn: function(){
            var activeItem =  this.collection.getActiveItem();
            var paths = [];
            _.each(activeItem, function(item){
                paths.push(item.get('path'));
            });

            this.channel.trigger("downloadBtnWithData", {paths:paths});
        },

        addNewItem: function(model){
            model.set("isSavedOnServer", false);
            var folder = this.getOneItem(model);
            this.$el.find('table tbody').prepend(folder.$el);
            folder.setNewName();

            this.listenTo(folder, "createNewFolder", this.createNewFolder);
            this.listenTo(folder, "inFolderBtn", this.goToPath);
            this.listenTo(folder, "isActiveChange", this.isActiveChange);
        },

        viewModeBtn: function(data){
            this.viewMode = data;
            this.render();
        }
    })

})
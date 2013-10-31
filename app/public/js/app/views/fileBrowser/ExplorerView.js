define([
    'marionette',
    'text!app/templates/fileBrowser/ExplorerTableView.html',
    'text!app/templates/fileBrowser/ExplorerIconView.html',
    

    /*views*/
    'app/views/fileBrowser/items/FolderView',
    'app/views/fileBrowser/items/FileView',
    'app/views/fileBrowser/items/ImageView'

], function(Marionette, ExplorerTableView, ExplorerIconView, FolderView, FileView, ImageView ){

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
            var _this = this;

            _.bind(this.setNewPath, this);
            _.bind(this.newFolderBtn, this);


            this.collection = data.collection;
            this.channel = data.channel;
            this.path = null;

            this.listenTo(this.channel, "setNewPath", this.setNewPath);
            this.listenTo(this.channel, "newFolderBtn", this.newFolderBtn);
            this.listenTo(this.channel, "deleteBtn", this.deleteBtn);
            this.listenTo(this.channel, "selectBtn", this.selectBtn);
            this.listenTo(this.channel, "downloadBtn", this.downloadBtn);
            this.listenTo(this.channel, "viewModeBtn", this.viewModeBtn);
            this.listenTo(this.collection, "reset", this.renderTable);
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
            var _this = this,
                tableTemplate;

            this.$el.html(this.explorerTableView());

            this.collection.each(function(item){
                var view = _this.getOneItem(item);

                _this.listenTo(view, "inFolderBtn", _this.goToPath);
                _this.listenTo(view, "rename", _this.rename);
                _this.listenTo(view, "isActiveChange", _this.isActiveChange);

                _this.$el.find('table tbody').append(view.$el);
            });
        },

        renderTable: function(){
            var _this = this;
            this.collection.sort({});

            this.$el.html("");
            var tableTemplate = this.explorerTableView();
            this.$el.html(tableTemplate);

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

            if( isDirectory ){
                return new FolderView({model:model});
            }else{
                //this is file

                if($.inArray(model.get('typeFile'), this.images) != -1 ){
                    //this is image
                    return new ImageView({model:model});
                }else{
                    //this is unknown file type
                    return new FileView({model:model});
                }

            }
        },

        newFolderBtn: function(){
            this.collection.push({})
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
            var folder = new FolderView({model:model});
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
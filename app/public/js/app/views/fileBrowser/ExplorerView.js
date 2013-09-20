define([
    'marionette',
    'text!app/templates/fileBrowser/ExplorerView.html',

    /*views*/
    'app/views/fileBrowser/FolderView',
    'app/views/fileBrowser/FileView'

], function(Marionette, template, FolderView, FileView){

    return Marionette.ItemView.extend({
        template: _.template(template),

        events: {

        },

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
            this.listenTo(this.collection, "reset", this.renderTable);
            this.listenTo(this.collection, "add", this.addNewItem);

        },

        setNewPath: function(data){
            this.path = data.path;
            this.collection.reset(data.data);
        },

        renderTable: function(){
            var _this = this;
            this.collection.sort({});
            var views = [];



            this.$el.find('table tbody').html("");
            this.collection.each(function(item){
                var view = _this.getOneItem(item);

                _this.listenTo(view, "inFolderBtn", _this.goToPath);
                _this.listenTo(view, "rename", _this.rename);
                _this.listenTo(view, "isActiveChange", _this.isActiveChange);

                _this.$el.find('table tbody').append(view.$el);
            });

            this.isActiveChange();
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
            if( model.get("isDirectory") ){
                return new FolderView({model:model});
            }else{
                return new FileView({model:model});
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

        addNewItem: function(model){
            model.set("isSavedOnServer", false);
            var folder = new FolderView({model:model});
            this.$el.find('table tbody').prepend(folder.$el);
            folder.setNewName();

            this.listenTo(folder, "createNewFolder", this.createNewFolder);
            this.listenTo(folder, "inFolderBtn", this.goToPath);
            this.listenTo(folder, "isActiveChange", this.isActiveChange);
        }
    })

})
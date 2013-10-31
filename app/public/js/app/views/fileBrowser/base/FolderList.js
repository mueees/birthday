define([
    'marionette',
    'text!app/templates/fileBrowser/FolderList.html',

    /*views*/
    './ItemBase'
], function(Marionette, template, ItemBase){

    return ItemBase.extend({
        template: _.template(template),

        events: {
            "click .inFolder": "inFolderBtn",
            "click": "chooseView",
            "blur .newName": "newNameBlur",
            "dblclick": "inFolderBtn"
        },

        tagName: "tr",

        className: "item folder",

        ui: {
            "newName" : ".newName",
            "name" : ".name",
            "inFolder" : ".inFolder"
        },

        initialize: function(){
            ItemBase.prototype.initialize.apply(this);

            _.bind(this.newNameBlur, this);

            this.render(this.model.toJSON());
            this.listenTo(this.model, "change:isSavedOnServer", this.showSavedState);
            this.listenTo(this.model, "newFolderCreated", this.newFolderCreated);
            this.listenTo(this.model, "newFolderDONTCreated", this.newFolderDONTCreated);

        },

        inFolderBtn: function(e){
            e.preventDefault();
            e.stopPropagation();

            this.trigger('inFolderBtn', {
                model: this.model
            });
        },

        newNameBlur: function(){

            var isSavedOnServer = this.model.get("isSavedOnServer"),
                _this = this,
                newName = $.trim(_this.ui.newName.val());

            this.model.set("newName", newName);
            this.model.set("newSize", "?");

            if( isSavedOnServer ){
                //this is rename
                this.trigger("rename", {
                    newName: newName,
                    model: _this.model
                })
            }else{
                //this is create New folder
                if(!newName){
                    this.model.destroy();
                    return false;
                }

                this.trigger("createNewFolder", {
                    newName: newName,
                    model: _this.model
                })
            }
        },

        newFolderCreated: function(){
            this.model.set("isActive", false);
            this.model.set("isSavedOnServer", true);
        },

        newFolderDONTCreated: function(){
            this.model.destroy();
        },

        showSavedState: function(){
            this.model.set('name',  this.model.get('newName'));
            this.model.set('path',  this.model.get('newPath'));
            this.model.set('size',  this.model.get('newSize'));
            this.render();
        },

        setNewName: function(){
            this.model.set("isActive", true);
            this.ui.newName.focus();
        }
    })

})
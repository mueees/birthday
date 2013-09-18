define([
    'marionette',
    'text!app/templates/fileBrowser/FolderView.html',

    /*views*/
    'app/views/fileBrowser/ItemBase'
], function(Marionette, template, ItemBase){

    return ItemBase.extend({
        template: _.template(template),

        events: {
            "click .inFolder": "inFolderBtn",
            "click": "chooseView",
            "blur .newName": "newNameBlur"
        },

        tagName: "tr",

        className: "item folder",

        ui: {
            "newName" : ".newName",
            "inFolder" : ".inFolder"
        },

        initialize: function(){
            _.bind(this.newNameBlur, this);

            this.render(this.model.toJSON());
            this.listenTo(this.model, "change:isActive", this.isActiveChange);
            this.listenTo(this.model, "change:isSavedOnServer", this.showSavedState);
            this.listenTo(this.model, "newFolderCreated", this.newFolderCreated);

        },

        inFolderBtn: function(e){
            e.preventDefault();
            e.stopPropagation();
            this.trigger('inFolderBtn', {
                model: this.model
            });
        },

        chooseView: function(){
            var isActive = this.model.get("isActive");
            this.model.set("isActive", !isActive);
        },

        isActiveChange: function(){
            var isActive = this.model.get("isActive");
            if(isActive){
                this.$el.addClass("active");
            }else{
                this.$el.removeClass("active");
            }
            this.trigger("isActiveChange");
        },

        newNameBlur: function(){

            var isSavedOnServer = this.model.get("isSavedOnServer"),
                _this = this;

            this.model.set("newName", _this.ui.newName.val());
            this.model.set("newSize", "?");

            if( isSavedOnServer ){
                //this is rename
                this.trigger("rename", {
                    newName: _this.ui.newName.val(),
                    model: _this.model
                })
            }else{
                //this is create New folder
                this.trigger("createNewFolder", {
                    newName: _this.ui.newName.val(),
                    model: _this.model
                })
            }
        },

        newFolderCreated: function(){
            this.model.set("isActive", false);
            this.model.set("isSavedOnServer", true);
        },

        showSavedState: function(){
            this.model.set('name',  this.model.get('newName'));
            this.model.set('path',  this.model.get('newPath'));
            this.model.set('size',  this.model.get('newSize'));
            this.render();
            /*this.ui.newName.addClass("off");
            this.ui.newName.removeClass("on");
            this.ui.inFolder.addClass("on");
            this.ui.inFolder.removeClass("off");*/
        },

        setNewName: function(){
            this.model.set("isActive", true);
            this.ui.newName.focus();
        }
    })

})
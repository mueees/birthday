define([
    'marionette',
    'text!app/templates/fileBrowser/ManageBtnView.html'
], function(Marionette, template){

    return Marionette.ItemView.extend({
        template: _.template(template),

        viewMode: "list",

        events: {
            "click .upBtn": "upBtn",
            "click .newFolderBtn": "newFolderBtn",
            "click .selectBtn": "selectBtn",
            "click .selectAllBtn": "selectAllBtn",
            "click .unSelectAllBtn": "unSelectAllBtn",
            "click .deleteBtn": "deleteBtn",
            "click .downloadBtn": "downloadBtn",
            "click .viewMode button": "viewModeBtn"
        },

        ui: {
            "deleteBtn": ".deleteBtn",
            "selectBtn": ".selectBtn",
            "selectAllBtn": ".selectAllBtn",
            "unSelectAllBtn": ".unSelectAllBtn",
            "downloadBtn": ".downloadBtn",
            "viewModeBtn" : ".viewMode button"
        },

        initialize: function(data){
            this.channel = data.channel;
            this.listenTo(this.channel, "currentItemSelected", this.itemSelectedChanged);
            this.listenTo(this.channel, "setNewPath", this.setNewPath);
        },

        upBtn: function(e){
            e.preventDefault();
            this.channel.trigger("up");
        },

        newFolderBtn: function(e){
            e.preventDefault();
            this.channel.trigger("newFolderBtn");
        },

        itemSelectedChanged: function(data){
            if( data.items.length ){
                this.ui.deleteBtn.removeClass('off');
                this.ui.selectBtn.removeClass('off');
                this.ui.downloadBtn.removeClass('off');

            }else{
                this.ui.deleteBtn.addClass('off');
                this.ui.selectBtn.addClass('off');
                this.ui.downloadBtn.addClass('off');
            }
        },

        deleteBtn: function(e){
            e.preventDefault();
            this.channel.trigger("deleteBtn");
        },

        selectBtn: function(e){
            e.preventDefault();
            this.channel.trigger("selectBtn");
        },

        selectAllBtn: function(e){
            e.preventDefault();
            this.channel.trigger("selectAllBtn");
            this.ui.selectAllBtn.addClass('off');
            this.ui.unSelectAllBtn.removeClass('off');
        },

        unSelectAllBtn: function(e){
            e.preventDefault();
            this.channel.trigger("unSelectAllBtn");
            this.ui.selectAllBtn.removeClass('off');
            this.ui.unSelectAllBtn.addClass('off');
        },

        setNewPath: function(){
            this.ui.selectAllBtn.removeClass('off');
            this.ui.unSelectAllBtn.addClass('off');
        },

        downloadBtn: function(e){
            e.preventDefault();
            this.channel.trigger("downloadBtn");
        },

        viewModeBtn: function(e){
            e.preventDefault();

            var $el = $(e.target),
                type = $el.data('type');

            if( this.viewMode == type ) return false;
            this.ui.viewModeBtn.removeClass('active');
            $el.addClass("active");

            this.viewMode = type;
            this.channel.trigger("viewModeBtn", type);
        }
    })

})
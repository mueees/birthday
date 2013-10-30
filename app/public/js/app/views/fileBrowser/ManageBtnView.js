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
            "click .deleteBtn": "deleteBtn",
            "click .downloadBtn": "downloadBtn",
            "click .viewMode button": "viewModeBtn"
        },

        ui: {
            "deleteBtn": ".deleteBtn",
            "selectBtn": ".selectBtn",
            "downloadBtn": ".downloadBtn",
            "viewModeBtn" : ".viewMode button"
        },

        initialize: function(data){
            this.channel = data.channel;
            this.listenTo(this.channel, "currentItemSelected", this.itemSelectedChanged)
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
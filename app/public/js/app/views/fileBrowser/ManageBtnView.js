define([
    'marionette',
    'text!app/templates/fileBrowser/ManageBtnView.html'
], function(Marionette, template){

    return Marionette.ItemView.extend({
        template: _.template(template),

        events: {
            "click .upBtn": "upBtn",
            "click .newFolderBtn": "newFolderBtn",
            "click .selectBtn": "selectBtn",
            "click .renameBtn": "renameBtn",
            "click .deleteBtn": "deleteBtn",
            "click .downloadBtn": "downloadBtn"
        },

        ui: {
            "deleteBtn": ".deleteBtn",
            "selectBtn": ".selectBtn",
            "downloadBtn": ".downloadBtn",
            "renameBtn": ".renameBtn"
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

                if( data.items.length == 1 ){
                    this.ui.renameBtn.removeClass('off');
                }else{
                    this.ui.renameBtn.addClass('off');
                }

            }else{
                this.ui.deleteBtn.addClass('off');
                this.ui.selectBtn.addClass('off');
                this.ui.renameBtn.addClass('off');
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

        renameBtn: function(e){
            e.preventDefault();
            this.channel.trigger("renameBtn");
        },

        downloadBtn: function(e){
            e.preventDefault();
            this.channel.trigger("downloadBtn");
        }
    })

})
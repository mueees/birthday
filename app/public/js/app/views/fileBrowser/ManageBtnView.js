define([
    'marionette',
    'text!app/templates/fileBrowser/ManageBtnView.html'
], function(Marionette, template){

    return Marionette.ItemView.extend({
        template: _.template(template),

        events: {
            "click .upBtn": "upBtn",
            "click .newFolderBtn": "newFolderBtn"
        },

        ui: {
            "deleteBtn": ".deleteBtn"
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
                this.ui.deleteBtn.show();
            }else{
                this.ui.deleteBtn.hide();
            }
        }
    })

})
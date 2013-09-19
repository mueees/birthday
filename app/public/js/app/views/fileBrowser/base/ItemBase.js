define([
    'marionette'
], function(Marionette){

    return Marionette.ItemView.extend({

        events: {
            "click": "chooseView"
        },

        initialize: function(){
            this.listenTo(this.model, "change:isActive", this.isActiveChange);
            this.listenTo(this.model, "destroy", this.close);
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

        renameBtn: function(e){
            e.preventDefault();
            this.setRenameState();
        },

        setRenameState: function(){
            this.ui.inFolder.addClass("off");
            this.ui.newName.removeClass("off");
        }

    })

})
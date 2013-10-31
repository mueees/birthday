define([
    'marionette'
], function(Marionette){

    return Marionette.ItemView.extend({

        delayClick: 70,

        events: {
            "click": "chooseView"
        },

        initialize: function(){
            this.listenTo(this.model, "change:isActive", this.isActiveChange);
            this.listenTo(this.model, "destroy", this.close);
            this.clicks = 0;
        },

        chooseView: function(){

            var _this = this;
            this.clicks++;

            if(this.clicks === 1) {
                _this.timer = setTimeout(function() {
                    var isActive = _this.model.get("isActive");
                    _this.model.set("isActive", !isActive);
                    _this.clicks = 0;
                }, _this.delayClick);
            }else{
                clearTimeout(this.timer);
                this.clicks = 0;
            }
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
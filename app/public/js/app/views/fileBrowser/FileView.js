define([
    'marionette',
    'text!app/templates/fileBrowser/FileView.html'
], function(Marionette, template){

    return Marionette.ItemView.extend({
        template: _.template(template),

        tagName: "tr",

        events: {
            "click .name" : "nameBtn",
            "click": "chooseView"
        },

        ui: {

        },

        initialize: function(){
            this.render(this.model.toJSON());
            this.listenTo(this.model, "change:isActive", this.isActiveChange);
        },

        nameBtn: function(){

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
        }
    })

})
define([
    'marionette',
    'text!../templates/StandartWindowView.html'
], function(Marionette, template){

    return Marionette.ItemView.extend({
        template: _.template(template),

        className: "modal hide fade",

        events: {
            "click .btn-close" : "closeBtn"
        },

        ui: {
            "value": ".accept"
        },

        initialize: function(){
            this.render();
            var model = this.model.toJSON();
            this.$el.addClass(model.customClass);
        },

        onRender: function(){
            var _this = this;

            this.$el.on("hide", function(){
                _this.trigger("hide");
            })
            this.$el.on("hidden", function(){
                _this.close();
            })

        },

        show: function(){
            this.$el.modal();
        },

        closeBtn: function(e){
            e.preventDefault();
            this.hideWindow();
        },

        hideWindow: function(){
            this.$el.modal('hide');
        }
    })

})
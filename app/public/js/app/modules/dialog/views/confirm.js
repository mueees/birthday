define([
    'marionette',
    'text!../templates/confirm.html'
], function(Marionette, template){

    return Marionette.ItemView.extend({
        template: _.template(template),

        className: "modal hide fade",

        events: {
            "click .btn-decline" : "declineBtn",
            "click .btn-accept": "acceptBtn"
        },

        ui: {
            "value": ".value"
        },

        initialize: function(){
            this.render();
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

        declineBtn: function(e){
            e.preventDefault();
            this.trigger("decline");
            this.$el.modal('hide');
            return false;
        },

        acceptBtn: function(e){
            e.preventDefault();
            this.trigger("accept");
            this.$el.modal('hide');
            return false;
        },

        getData: function(){
            return this.ui.value.val();
        }
    })

})
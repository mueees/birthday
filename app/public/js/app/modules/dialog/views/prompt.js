define([
    'marionette',
    'text!../templates/prompt.html'
], function(Marionette, template){

    return Marionette.ItemView.extend({
        template: _.template(template),

        className: "modal hide fade",

        events: {
            "click .btn-close" : "closeBtn",
            "click .btn-accept": "acceptBtn"
        },

        ui: {
            "value": ".accept"
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

        closeBtn: function(e){
            e.preventDefault();
            this.$el.modal('hide');
        },

        acceptBtn: function(e){
            e.preventDefault();
            this.trigger("accept", this.getData());
            this.$el.modal('hide');
            return false;
        },

        getData: function(){
            return this.ui.value.val();
        }
    })

})
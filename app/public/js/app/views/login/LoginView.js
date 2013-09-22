define([
    'marionette',
    'text!app/templates/login/LoginView.html'
], function(Marionette, template){

    return Marionette.ItemView.extend({
        template: _.template(template),

        className: "modal fade out",

        events: {
            "submit": "submit"
        },

        ui: {
            "password": ".password"
        },

        initialize: function(){
            _.bind(this.submit, this);
            this.render();
        },

        show: function(){
            var _this = this;
            this.$el.modal();
            setTimeout(function(){
                _this.$el.find('.password').focus();
            }, 400)
        },

        getData: function(){
            return {
                password: $.trim(this.ui.password.val())
            }
        },

        submit: function(e){
            if(e) e.preventDefault();
            this.trigger("checkPassword", this.getData());
            this.hide();
        },

        hide: function(){
            this.$el.modal("hide");
        }

    })

})
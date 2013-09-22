define([
    'marionette'
], function(Marionette, template){

    return Marionette.ItemView.extend({

        el: ".loginMenu",

        events: {
            "click .login": "login",
            "click .logout": "logout"
        },

        ui: {
            "login": ".login",
            "logout": ".logout"
        },

        initialize: function(data){
            this.channel = data.channel;
            this.listenTo(this.channel, "changeLoginState", this.changeLoginState);
        },

        onRender: function(){
        },

        changeLoginState: function(data){
            this.removeOff();

            if( data.state ){
                this.loginState();
            }else{
                this.unLoginState();
            }
        },

        removeOff: function(){
            this.$el.find('.off').removeClass("off");
        },

        loginState: function(){
            this.$el.find('.logout').show();
            this.$el.find('.login').hide();
        },

        unLoginState: function(){
            this.$el.find('.login').show();
            this.$el.find('.logout').hide();
        },

        login: function(e){
            if(e) e.preventDefault();
            this.trigger("login");
        },

        logout: function(e){
            if(e) e.preventDefault();
            this.trigger("logout");
        }
    })

})
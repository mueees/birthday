define([
    'jquery',
    'backbone',
    'marionette',
    'app/app',

    /*app*/
    'app/login/login_app'

], function(jQuery, Backbone, Marionette, App){

    var LoginApp = App.module('Login');

    var API = {

        userIsLogin: function(){
            return LoginApp.API.getLoginState();
        }
    }


    App.reqres.setHandler('user:islogin', function(){
        return API.userIsLogin();
    })

})
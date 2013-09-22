define([
    'jquery',
    'backbone',
    'marionette',
    'app/app',

    /*views*/
    'app/views/login/LoginBtnView',
    'app/views/login/LoginView',

    /*modules*/
    'app/modules/notify/module'


], function(jQuery, Backbone, Marionette, App, LoginBtnView, LoginView){

    App.module("Login", {
        startWithParent: true,

        define: function( Login, App, Backbone, Marionette, $, _ ){


            var user = false;

            /*modules*/
            var Notify = App.module("Notify");


            var Controller = {

                init: function(){

                    var _this = this;

                    user = (Birthday.login === 'true') ? true : false;
                    var loginBtnView = new LoginBtnView({
                        channel: App.channels.main
                    });
                    loginBtnView.on("login", function(){
                        _this.showLoginForm();
                    })
                    loginBtnView.on("logout", function(){
                        _this.logOut();
                    })

                },

                logOut: function(){
                    var _this = this;
                    $.ajax({
                        type: "post",
                        url: App.config.api.logout,
                        success: function(data){
                            _this.logoutUserSuccess(data);
                        },
                        error: function(data){
                            _this.logoutUserError(data);
                        }
                    })
                },

                logoutUserSuccess: function(data){
                    user = false;
                    App.channels.main.trigger("changeLoginState", {
                        state: user
                    });
                    Notify.API.showNotify({text: "Bye, bye..."});
                },

                logoutUserError: function(data){
                    Notify.API.showNotify({text: "Somthing wrong"});
                },

                showLoginForm: function(){
                    var loginView = new LoginView(),
                        _this = this;

                    loginView.show();

                    loginView.on("checkPassword", function(data){
                        _this.checkPassword(data);
                    })
                },

                checkPassword: function(data){

                    var _this = this;

                    $.ajax({
                        type: "post",
                        data: data,
                        url: App.config.api.login,
                        success: function(data){
                            _this.loginUserSuccess(data);
                        },
                        error: function(data){
                            _this.loginUserError(data);
                        }
                    })
                },

                loginUserSuccess: function(data){
                    user = true;
                    App.channels.main.trigger("changeLoginState", {
                        state: user
                    });
                    Notify.API.showNotify({text: "Hi! Success password!"});
                },

                loginUserError: function(data){
                    Notify.API.showNotify({text: "Password wrong"});
                },

                getLoginState: function(){
                    return user;
                },

                accessDenied: function(){
                    Notify.API.showNotify({text: "Please login."});
                }
            }

            var API  = {
                addEvent: Controller.addEvent,
                getLoginState: function(){
                    return Controller.getLoginState()
                }
            }

            Login.API = API;

            App.channels.main.on("accessDenied", Controller.accessDenied)
            Login.on()

            Controller.init();


        }
    })


})
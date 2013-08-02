define([
    'jquery',
    'backbone',
    'marionette', 
    'app/app',
    'app/modules/cache/cache_app',

    './views/addUser',
    './views/showUser'
    ], function(jQuery, Backbone, Marionette, App, cache_app, addUserView, showUserView){

	App.module("User", {
		startWithParent: false,

		define: function( User, App, Backbone, Marionette, $, _ ){

            //create Router
            var Router = Marionette.AppRouter.extend({

                before: function(){
                    App.startSubApp( "User", {} );
                },

                appRoutes: {

                    "": 'addUser',

                    "user/add": 'addUser',

                    "user/change/:id": 'changeUser',

                    'user/:id' : 'showUser'
                }

            })

            //create Api
            var API = {
                addUser: function(){
                    User.Controller.addUser();
                },

                changeUser: function(){
                    User.Controller.changeUser();
                },

                showUser: function(){
                    User.Controller.showUser();
                }
            }

            //create Controller
            User.Controller ={

                addUser: function(){
                    var addUserView = this._getAddUserView();
                    App.main.show(addUserView);
                },

                changeUser: function(){
                    
                },

                showUser: function(){
                    var done = _.bind(this._showUserSuccess, this);
                    var fail = _.bind(this._showUserError, this);

                    var def = $.when( App.request('user:getById', 50) ).fail(fail).done(done);
                },

                _showUserSuccess: function( data ){
                    var showUserView = this._getShowUserView();
                    App.main.show(showUserView);
                },

                _showUserError: function(){
                    Backbone.history.navigate("/");
                    console.log("ERROR USER APP")
                },

                _getAddUserView: function(){
                    return new addUserView();
                },

                _getShowUserView: function(){
                  return new showUserView();  
                }
            }

            App.addInitializer(function(){
                new Router({
                    controller: API
                })
            })

		}

	})

})
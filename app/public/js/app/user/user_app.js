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
                    var saveNewUser = _.bind(this.saveNewUser, this);

                    addUserView.on('addNewUser', saveNewUser);
                    App.main.show(addUserView);

                    $.ajax({
                        type: "GET",
                        url: "api/users",
                        data: {
                            month: ['06'],
                            year: ['2014']
                        },
                        success: function(){
                            debugger
                        },
                        error: function(){

                        }
                    })
                },

                saveNewUser: function( data ){

                    var success = _.bind(this._saveNewUserSuccess, this);
                    var error = _.bind(this._saveNewUserError, this);

                    $.when( App.request('user:saveNewUser', data)).fail( error ).done( success );

                },

                _saveNewUserSuccess: function( data ){
                    console.log(data);
                },

                _saveNewUserError: function( data ){
                    console.log(data);
                },

                changeUser: function(){
                    
                },

                showUser: function(){
                    var success = _.bind(this._showUserSuccess, this);
                    var error = _.bind(this._showUserError, this);

                    var def = $.when( App.request('user:getById', 50) ).fail(error).done(success);
                },

                _showUserSuccess: function( data ){
                    var showUserView = this._getShowUserView();
                    App.main.show(showUserView);
                },

                _showUserError: function(){
                    Backbone.history.navigate("/");
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
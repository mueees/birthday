define([
    'jquery',
    'backbone',
    'marionette',
    'app/app',
    'app/modules/cache/cache_app',
    './list/module',

    './views/addUser',
    './views/showUser',
    './views/changeUser'
], function(jQuery, Backbone, Marionette, App, cache_app, ListModule, addUserView, showUserView, changeUserView){

    App.module("User", {
        startWithParent: false,

        define: function( User, App, Backbone, Marionette, $, _ ){

            //create Router

            var Router = Marionette.AppRouter.extend({

                before: function(){
                    if(!User.Controller.determineAccess()){
                        return false;
                    }
                    App.startSubApp( "User", {} );
                },

                appRoutes: {

                    "user/add": 'addUser',

                    "user/change/:id": 'changeUser',

                    'user/:id' : 'showUser',

                    "users" : "showUsers"
                }

            })

            //create Api
            var API = {
                addUser: function(){
                    User.Controller.addUser();
                },

                changeUser: function( id ){
                    User.Controller.changeUser( id );
                },

                showUser: function(id){
                    User.Controller.showUser(id);
                },

                showUsers: function(){
                    User.List.Controller.showUsers();
                }
            }

            //create Controller
            User.Controller ={

                determineAccess: function(){
                    var state = App.request('user:islogin');
                    if(!state){
                        Backbone.history.navigate("/");
                        App.channels.main.trigger("accessDenied");
                        return false;
                    }else{
                        return true;
                    }
                },

                addUser: function(){
                    var addUserView = this._getAddUserView();
                    var saveNewUser = _.bind(this.saveNewUser, this);

                    addUserView.on('addNewUser', saveNewUser);
                    App.main.show(addUserView);
                },

                saveNewUser: function( data ){

                    var success = _.bind(this._saveNewUserSuccess, this);
                    var error = _.bind(this._saveNewUserError, this);

                    $.when( App.request('user:saveNewUser', data)).fail( error ).done( success );

                },

                _saveNewUserSuccess: function( data ){
                    var user = data.model;
                    Backbone.history.navigate("/#user/" + user.get('_id'));
                },

                _saveNewUserError: function( data ){
                    console.log(data);
                },

                saveChangeUser: function(newData, model){
                    model.set(newData);

                    model.save({}, {
                        success: function( model, response, options ){
                            Backbone.history.navigate("/#user/" + model.get('_id'));
                        },
                        error: function(model, response, options){
                            debugger
                        }
                    });
                },

                changeUser: function(id){
                    var success = _.bind(this._showChangeUserView, this);
                    var error = _.bind(this._routeToHome, this);

                    $.when( App.request('user:getById', id) ).fail(error).done(success);
                },

                showUser: function(id){

                    var success = _.bind(this._showUserSuccess, this);
                    var error = _.bind(this._showUserError, this);

                    $.when( App.request('user:getById', id) ).fail(error).done(success);
                },

                _showUserSuccess: function( data ){

                    var model = data.model;
                    var showUserView = this._getShowUserView( model );
                    App.main.show(showUserView);
                },

                _showUserError: function(){
                    Backbone.history.navigate("/");
                },

                _getAddUserView: function(){
                    return new addUserView();
                },

                _getShowUserView: function(model){
                    return new showUserView({model: model});
                },

                _getChangeUserView: function(model){
                    return new changeUserView({model: model});
                },

                _showChangeUserView: function( data ){
                    var model = data.model;
                    var changeUserView = this._getChangeUserView( model );
                    var saveChangeUser = _.bind(this.saveChangeUser, this);

                    changeUserView.on('changeUser', function( newData ){
                        saveChangeUser( newData, model );
                    })
                    App.main.show(changeUserView);
                },

                _routeToHome: function( data ){
                    Backbone.history.navigate("/");
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
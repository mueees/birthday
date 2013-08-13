define([
    'app/app',
    './list_layout',

    '../search/module',
    '../users_list/module'
], function(App, Layout){

    App.module("User.List", {
        startWithParent: false,

        define: function(List, App, Backbone, Marionette, $, _){

            List.Controller = {
                showUsers: function(){

                    var done = _.bind(this._showUsersSuccess, this)
                    var error = _.bind(this._showUsersError, this)

                    $.when(
                        App.User.Search.Api.getView(),
                        App.User.Users_list.Api.getView()
                    ).done( done ).fail( error );

                },

                _showUsersSuccess: function( searchView, usersLayout ){

                    //get Layout
                    var layout = new Layout();
                    layout.render();

                    //append layout to DOM
                    App.main.show( layout );

                    layout.search.show( searchView );
                    layout.$el.find(".users").append(usersLayout.$el)

                },

                _showUsersError: function(){
                    debugger
                }
            }


        }
    })

})
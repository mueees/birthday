define([
	'app/app',
	'marionette',
	'app/layouts/user/users_list/layout'

	
	], function(App, Marionette, Layout){


	App.module('User.Users_list', {

		startWithParent: false,

        define: function(Users_list, App, Backbone, Marionette, $, _){

			var API = {
				display: function( region ){

					Controller.displayView( region )

				}
			}

        	var Controller = {
        		displayView: function( region ){

        			//получить данные про всех юзеров
        			var success = _.bind(this._getViewSuccess, this);
                    var error = _.bind(this._getViewError, this);

                    $.when( App.request('user:getUsers') ).fail(error).done(function(collection){ success(collection, region) });

        		},

        		_getViewSuccess: function( collection, region ){
        			
        		},

        		_getViewError: function( data ){
        			debugger
        		}
        	}

        	Users_list.Api = API;

        }


	})


})
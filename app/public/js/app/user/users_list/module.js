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

					var view = Controller.getView();

				}
			}

        	var Controller = {
        		getView: function(){

        			//получить данные про всех юзеров
        			var success = _.bind(this._showUserSuccess, this);
                    var error = _.bind(this._showUserError, this);

                    var def = $.when( App.request('user:getById', 50) ).fail(error).done(success);

        			//отрендерить их

        			//вставить в лайаут

        			//отдать результат

        		}
        	}

        }


	})


})
define([
	'app/app',
	'marionette',
    'app/views/user/users_list/user',
	'app/layouts/user/users_list/layout'
	
	], function(App, Marionette, OneUserView, Layout){


	App.module('User.Users_list', {

		startWithParent: false,

        define: function(Users_list, App, Backbone, Marionette, $, _){

			var API = {
                getView: function(){
                    var deferred = new $.Deferred();
                    Controller.getView( deferred );
                    return deferred.promise();
                }
			}

        	var Controller = {

                getView: function( deferred ){

                    //получить данные про всех юзеров
                    var success = _.bind(this._renderView, this);
                    var error = _.bind(this._getUserError, this);

                    $.when( App.request('user:getUsers') ).fail(error).done(function( data ){success(data, deferred)});

                },

        		_renderView: function( data, deferred ){
                    var oneUserView;
                    var layout = new Layout();
                    layout.render();


                    var collection = data.userCollection;

                    collection.each(function(model, index) {
                        oneUserView = new OneUserView({model: model});
                        oneUserView.render();
                        layout.$el.find('.userItems').append( oneUserView.$el );
                    });


                    deferred.resolve( layout );

        		},

        		_getUserError: function( data ){
        			debugger
        		}
        	}

        	Users_list.Api = API;

        }


	})


})
define([
	'app/app',
	'marionette',

	'app/views/user/search/search'
	], function(App, Marionette, SearchView){


		App.module("User.Search", {

			startWithParent: true,

	        define: function(List, App, Backbone, Marionette, $, _){

	        	var Controller = {
                    getView: function( deferred ){
                        var searchView = new SearchView();
                        deferred.resolve( searchView );
                    }
	        	}

	        	var API = {
                    getView: function (){
                        var deferred = new $.Deferred();
                        Controller.getView( deferred );
                        return deferred.promise();
                    }
	        	}

				List.Api = API;


	        }
		})

	})
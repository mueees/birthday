define([
	'app/app',
	'marionette',

	'app/views/user/search/search'
	], function(App, Marionette, SearchView){


		App.module("User.Search", {

			startWithParent: true,

	        define: function(List, App, Backbone, Marionette, $, _){

	        	var Controller = {
	        		showUsers: function(){

	        		}
	        	}

	        	var API = {
	        		display: function( region ){
	        			var searchView = new SearchView();
	        			region.show( searchView );
	        		}
	        	}

				List.Api = API;


	        }
		})

	})
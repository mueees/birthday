define([
	'backbone'
	], function(Backbone){
		return Backbone.Model.extend({
			defaults: {
				type: null, //save on DB or save on file
				typeRequest: 'http',
				name: "Monitor Name",
				url: null,
				monitorInterval: 15, // in millisecond
				timeLimit: 15, // time, when request was failed
				keyword: null,
				keywordShould: null // exist or not exist
			}	
		})
	})
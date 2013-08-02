define(['backbone', 'app/app'], function(Backbone, App){

	App.module("Entities", function (Entities, App, Backbone, Marionette, $, _) {
		Entities.Collection = Backbone.Collection.extend({});
	});

})
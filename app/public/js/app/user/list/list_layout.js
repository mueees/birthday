define([
	'backbone',
	'marionette',

	'text!app/templates/user/list/layout.html'
	], function(Backbone, Marionette, LayoutTemp){

		var Layout = Marionette.Layout.extend({
			template: LayoutTemp,
			regions: {
				'search': '.search',
				'users': '.users'	
			}
		})

		return Layout;

	})
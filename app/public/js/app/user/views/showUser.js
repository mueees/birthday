define([
	'backbone',
	'marionette',
	'text!../templates/showUser.html'
	], function(Backbone, Marionette, templateView){

		var ShowUserView = Marionette.ItemView.extend({
			template: _.template( templateView ),

			initialize: function(){}
		})

		return ShowUserView

	})
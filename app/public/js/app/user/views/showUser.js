define([
	'backbone',
	'marionette',
	'text!app/templates/user/showUser.html'
	], function(Backbone, Marionette, templateView){

		var ShowUserView = Marionette.ItemView.extend({
			template: _.template( templateView ),

			initialize: function(){}
		})

		return ShowUserView

	})
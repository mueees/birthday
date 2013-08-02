define([
	'backbone',
	'marionette',
	'text!../templates/addUser.html'
	], function(Backbone, Marionette, templateView){

		var AddUserView = Marionette.ItemView.extend({
			template: _.template( templateView ),

            events: {

            },

			initialize: function(){

                //validate info


            }
		})

		return AddUserView

	})
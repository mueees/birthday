define([
	'marionette',
	'text!app/templates/user/search/search.html'
	], function(Marionette, searchTemp){


		return Marionette.ItemView.extend({
			template: _.template(searchTemp)
		})

})
define([
	'marionette',
	'text!app/templates/user/users_list/layout.html'
	
	], function(Marionette, LayoutTemp){


		var Layout = Marionette.Layout.extend({
			template: LayoutTemp,
			regions: {
				'userItems': '.userItems',
			}
		})

		return Layout;

	})
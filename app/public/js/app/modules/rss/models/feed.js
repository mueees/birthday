define([
	'backbone'
	], function(Backbone){

		return Backbone.Model.extend({
			defaults: {
				name: "",
                url: "",
                unread: "",
                posts: []
			},
            idAttribute: '_id'
		})

});
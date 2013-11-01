define([
	'backbone',
    '../collections/feeds'
	], function(Backbone, FeedCollection){

		return Backbone.Model.extend({
			defaults: {
				name: "",
                feeds: new FeedCollection()
			},
            idAttribute: '_id'
		})

});
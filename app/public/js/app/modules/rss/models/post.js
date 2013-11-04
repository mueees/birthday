define([
	'backbone'
	], function(Backbone){

		return Backbone.Model.extend({
			defaults: {
			    title: String,
			    description: String,
			    summary: String,
			    link: String,
			    date: Date,
			    pubdate: String,
			    guid: String,
			    image: String,
			    source: String,
			    id_feed: String,
			    isRead: Boolean
			},
			urlRoot: "/api/rss/post",
			idAttribute: '_id'
		})

})
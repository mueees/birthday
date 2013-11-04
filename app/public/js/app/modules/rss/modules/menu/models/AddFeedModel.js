define([
	'backbone',
	'../../collections/feed'
	], function(Backbone, FeedColl){

		return Backbone.Model.extend({
			defaults: {
				feed_url: "",
				feeds: null
			},
			initialize: function(){
				console.log('initialize');
			}
		})

});
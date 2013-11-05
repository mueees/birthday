define([
	'backbone',
    '../collections/feeds'
	], function(Backbone, FeedCollection){

		return Backbone.Model.extend({
			defaults: {
				name: "",
				feeds: null
			},

            initialize: function(data){
                this.set('feeds', new FeedCollection(data.feeds))
            },

            idAttribute: '_id'
		})
		
});
define([
    'app/app',
	'backbone',
    '../collections/feeds'
	], function(App, Backbone, FeedCollection){

		return Backbone.Model.extend({
			defaults: {
				name: "",
				feeds: null
			},

            urlRoot: App.config.api.rss.category,

            socket: true,

            initialize: function(data){

            },

            idAttribute: '_id',

            model: {
                feeds: FeedCollection
            },

            parse: function(response){
                for(var key in this.model){
                    var embeddedClass = this.model[key];
                    var embeddedData = response[key];
                    response[key] = new embeddedClass(embeddedData, {parse:true});
                }
                return response;
            }
		})
		
});
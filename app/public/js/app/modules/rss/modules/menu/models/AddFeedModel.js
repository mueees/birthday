define([
	'backbone',
	'../../../collections/feeds'
	], function(Backbone, Feeds){

		return Backbone.Model.extend({

			defaults: {
				feed_url: "",
				feeds: null
			},

            socket: true,

			initialize: function(){
				console.log('initialize');
			},

            parse: function( feeds ){
                this.set('feeds', new Feeds(feeds) );
            }
		})

});
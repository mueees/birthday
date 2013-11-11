define([
	'backbone',
	'../../../collections/feeds'
	], function(Backbone, FeedsCollection){

		return Backbone.Model.extend({

			defaults: {
				feed_url: "",
				feeds: null
			},

            model: {
                feeds: FeedsCollection
            },

            socket: true,

			initialize: function(){
                
			},

            parse: function(response){

                for(var key in this.model)
                {
                    var embeddedClass = this.model[key];
                    var embeddedData = response[key];
                    response[key] = new embeddedClass(embeddedData, {parse:true});
                }
                return response;
            }

		})

});
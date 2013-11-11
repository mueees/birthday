define([
    'app/app',
	'backbone',
    '../collections/posts'
	], function(App, Backbone, PostCollection){

		return Backbone.Model.extend({

            model: {
                posts: PostCollection
            },

            defaults: {
				name: "",
                url: "",
                unread: "",
                posts: null
			},

            idAttribute: '_id',

            initialize: function(data){
                //debugger
                //this.set('posts', new PostCollection(data.posts))
            },

            urlRoot: App.config.api.rss.feed,

            socket: true,

            parse: function(response){

                //debugger
                for(var key in this.model)
                {
                    var embeddedClass = this.model[key];
                    var embeddedData = response[key];
                    response[key] = new embeddedClass(embeddedData, {parse:true});
                }
                return response;
            },

            toJSON: function() {
                var json = Backbone.Model.prototype.toJSON.apply(this, arguments);
                json.cid = this.cid;
                return json;
            }
		})

});
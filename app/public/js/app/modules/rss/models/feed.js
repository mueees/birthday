define([
	'backbone',
    '../collections/posts'
	], function(Backbone, PostCollection){

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
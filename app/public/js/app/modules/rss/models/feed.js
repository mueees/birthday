define([
	'backbone',
    '../collections/posts'
	], function(Backbone, PostCollection){

		return Backbone.Model.extend({
			defaults: {
				name: "",
                url: "",
                unread: "",
                posts: null
			},
            idAttribute: '_id',

            initialize: function(data){
                this.set('posts', new PostCollection(data.posts))
            },

            toJSON: function() {
                var json = Backbone.Model.prototype.toJSON.apply(this, arguments);
                json.cid = this.cid;
                return json;
            }
		})

});
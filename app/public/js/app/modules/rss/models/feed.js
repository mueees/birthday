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
            },

            url: function(){
                return App.config.api.rss.feed
            },

            socket: true,

            parse: function(response){

                //debugger
                for(var key in this.model)
                {
                    var embeddedClass = this.model[key];
                    var embeddedData = response[key];
                    response[key] = new embeddedClass(embeddedData, {parse:true});
                    if (key == 'posts'){
                        response[key].id_feed = this.get('_id');
                    }
                }
                return response;
            },

            toJSON: function() {
                var json = Backbone.Model.prototype.toJSON.apply(this, arguments);
                json.cid = this.cid;
                return json;
            },

            getDataForSave: function(){
                var data = this.toJSON();
                delete data.posts;
                return data;
            },

            getMore: function(options){
                var postsCollection = this.get('posts');
                postsCollection.getMore(options);
            }
		})

});
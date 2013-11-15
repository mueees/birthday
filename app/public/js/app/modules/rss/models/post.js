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
			    isRead: Boolean,
			    readLater: false
			},
			urlRoot: "/api/rss/post",

			idAttribute: '_id',

			socket: true,

			setRead: function(options){

				options = options || {};

				_.extend(options, {
					params: {
						isRead: true,
						_id: this.get('_id')
					},
					method: '/api/rss/post/changeIsReadState'
				})

				this.fetch(options);
			},

			setUnRead: function(options){
				options = options || {};

				_.extend(options, {
					params: {
						isRead: false,
						_id: this.get('_id')
					},
					method: '/api/rss/post/changeIsReadState'
				})

				this.fetch(options);
			},

			readLater: function(options){
				options = options || {};

				_.extend(options, {
					params: {
						readLater: true,
						_id: this.get('_id')
					},
					method: '/api/rss/post/postReadLater'
				})

				this.fetch(options);
			},

			unReadLater: function(options){
				options = options || {};

				_.extend(options, {
					params: {
						readLater: false,
						_id: this.get('_id')
					},
					method: '/api/rss/post/postReadLater'
				})

				this.fetch(options);
			}
		})

})
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

            socket: true,

            initialize: function(data){
                if( data.feeds && _.isArray(data.feeds) ){
                    this.set('feeds', new FeedCollection( data.feeds ))
                }
            },

            idAttribute: '_id',

            url: function(){
                return App.config.api.rss.category
            },

            model: {
                feeds: FeedCollection
            },

            parse: function(response){
                for(var key in this.model){
                    var embeddedClass = this.model[key];
                    var embeddedData = response[key];
                    if( !embeddedData && this.get(key) ) continue;
                    response[key] = new embeddedClass(embeddedData, {parse:true});
                }
                return response;
            },

            save: function(key, value, options){
                if( this.isNew() ){
                    return Backbone.Model.prototype.save.apply(this, [key, value, options]);
                    //return this._save(options);
                }else{
                    return this.update(options);
                }
            },

            /*_save: function(options){
                options = options || {};
                options.params = this.getDataForUpdate()
                return this.sync('create', this, options);
            },*/

            update: function( options ){
                options = options || {};
                options.params = this.getDataForUpdate()
                return this.sync('update', this, options);
            },

            getDataForUpdate: function(){
                var feedsForSave = [];
                var data = this.toJSON();

                _.each(data.feeds, function(feed){
                    var _id = feed._id;
                    if(!_id) return false;
                    feedsForSave.push(_id);
                })

                data.feeds = feedsForSave;
                return data;
            }
		})
		
});
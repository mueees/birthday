define([
    'app/app',
    'backbone',
    'marionette',
    '../models/post',
    'app/collections/_base/collection'
],function(App, Backbone, Marionette, PostModel, BaseColletion){

    return BaseColletion.extend({
        model: PostModel,

        url: function(){
            return "/api/rss/posts";
        },

        socket: true,

        getFrom: 0,

        count: 40,

        getPosts: function(data){
            data.method = App.config.api.rss.getPostsByCreteria;
            this.fetch(data);
        },

        getMore: function(options){
            var options = options || {},
                _this = this;
            var success = options.success;

            options.success = function(resp) {
                _this.getFrom += _this.count;
                if(success) { success(_this, resp); }
            };

            _.extend(options, {
                method : App.config.api.rss.getPostsByCreteria,
                remove: false
            });

            if( !options.params ) options.params = {};
            _.extend(options.params, {
                    id_feed: this.id_feed,
                    getFrom: this.getFrom,
                    count: this.count
                });
            

            this.fetch( options );
        },

        fetch: function(options) {
            typeof(options) != 'undefined' || (options = {});
            var _this = this;
            var success = options.success;
            options.success = function(resp) {
                if(success) { success(_this, resp); }
            };
            return Backbone.Collection.prototype.fetch.call(this, options);
        }
    })

})
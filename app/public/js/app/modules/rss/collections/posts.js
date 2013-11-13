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

        params: {
            startFrom: 0,
            count: 25
        },

        getPosts: function(data){
        	data.method = App.config.api.rss.getPostsByCreteria;
        	this.fetch(data);
        }
    })

})
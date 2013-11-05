define([
    'marionette',
    'text!../templates/FeedView.html',
    './PostList'
], function(Marionette, template, PostList){

    return Marionette.ItemView.extend({
        template: _.template(template),

        events: {

        },

        ui: {

        },

        viewMode: "list",

        initialize: function(){

        },

        onRender: function(){
            this.renderPosts()
        },

        renderPosts: function(){
            var PostView = this.getPostView(),
                _this = this,
                posts = this.model.get('posts');

            debugger
            posts.each(function(post){
                debugger
                var postView = new PostView({model:post});
                _this.$el.find('.content ul').append(postView.$el);
            })

        },

        getPostView: function(){
            if( this.viewMode == "list" ){
                return PostList;
            }
        }
    })

})
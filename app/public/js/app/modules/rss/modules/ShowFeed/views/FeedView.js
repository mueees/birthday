define([
    'marionette',
    'text!../templates/FeedView.html',
    './PostList',
    './FullView'
], function(Marionette, template, PostList, FullView){

    return Marionette.ItemView.extend({
        template: _.template(template),

        events: {

        },

        ui: {

        },

        viewMode: "list",

        initialize: function(){
            _.bindAll(this, "checkPost");
        },

        onRender: function(){
            this.renderPosts()
        },

        renderPosts: function(){
            var PostView = this.getPostView(),
                _this = this,
                posts = this.model.get('posts');

            posts.each(function(post){
                var postView = new PostView({model:post});
                _this.$el.find('.content ul').append(postView.$el);
                postView.on("checkPost", _this.checkPost);
            })

        },

        checkPost: function(postModel){
            var cid = postModel.cid,
            _this = this;
            this.clearFullView();

            if( this.viewMode == "list" ){
                var $viewSmall = this.$el.find('.' + cid).hide();
                var fullView = new FullView({model:postModel});
                fullView.on("closeFullView", function(){
                    _this.clearFullView();
                });
                $viewSmall.hide();
                $viewSmall.after(fullView.$el);
            }
        },

        clearFullView: function(){
            this.$el.find(".fullView").remove();
            this.$el.find(".rss_post").show();
        },

        getPostView: function(){
            if( this.viewMode == "list" ){
                return PostList;
            }
        }
    })

})
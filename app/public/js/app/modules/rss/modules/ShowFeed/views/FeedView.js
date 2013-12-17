define([
    'marionette',
    'text!../templates/FeedView.html',
    './PostList',
    './FullView',
    './PostPreview'
], function(Marionette, template, PostList, FullView, PostPreview){

    return Marionette.ItemView.extend({
        template: _.template(template),

        events: {
            "click .viewMode a": "changeViewMode",
            "click .getMore": "getMore"
        },

        ui: {

        },

        viewMode: "list",

        initialize: function(options){

            this.readLater = options.readLater;

            _.bindAll(this, "checkPost");
            this.posts = this.model.get('posts');
            this.listenTo(this.posts, "add", this.renderPosts);
        },

        onRender: function(){
            this.addReadLaterState();
            this.renderPosts();
        },

        addReadLaterState: function(){
            if( this.readLater ){
                this.$el.find('.title').html( this.model.get('name') + " :saved" );    
            }
        },

        renderPosts: function(){
            var PostView = this.getPostView(),
                _this = this,
                posts = this.model.get('posts');

            this.$el.find('.content ul').html("");

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

            var $viewSmall = this.$el.find('.' + cid).hide();
            var topPosition = $('body').scrollTop();

            var fullView = new FullView({model:postModel});
            fullView.on("closeFullView", function(){
                _this.clearFullView();

                $('body').scrollTop(topPosition);
                $viewSmall.addClass('lastViewed');
                setTimeout(function(){
                    $viewSmall.removeClass('lastViewed');
                }, 500)

            });
            $viewSmall.hide();
            $viewSmall.after(fullView.$el);

            $('body').scrollTop(fullView.$el.offset().top);
        },

        clearFullView: function(){
            this.$el.find(".fullView").remove();
            this.$el.find(".rss_post").show();
        },

        getPostView: function(){
            if( this.viewMode == "list" ){
                return PostList;
            }else if( this.viewMode == "preview" ){
                return PostPreview;
            }
        },

        changeViewMode: function(e){
            e.preventDefault();

            var $el = $(e.target).closest('a');
            var type = $el.data('type');

            if( this.viewMode == type ) return false;

            this.$el.find('.viewMode a').removeClass("active");
            $el.addClass('active');

            this.viewMode = type;
            this.renderPosts();
        },

        getMore: function(e){
            e.preventDefault();
            this.model.getMore();
        }
    })

})
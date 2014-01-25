define([
    'marionette',
    'text!../templates/Feeds.html'
], function(Marionette, template){

    return Marionette.ItemView.extend({
        template: _.template(template),

        events: {
            "click .personalize": "personalizeBtn",
            "click .showSavedPost": "showSavedPost",
            "click .switcher": "changeSwitcher",
            "click .categories .feeds li" : "showFeed",
            "click .categories .feeds li .saved" : "showSavedFeed",
            "click .categories .feeds .unread": "setAllPostUnread"
        },

        className: "feedContent",

        ui: {

        },

        initialize: function(options){
            this.collection = options.collection;
            this.listenTo( this.collection, "change:unread", this.changeUnread);
            this.render();
        },

        render: function(){
            var view = this.template({
                categories: this.collection.toJSON()
            });

            this.$el.html(view);
            this.reRenderTotalUnreadPosts();
        },

        reRenderTotalUnreadPosts: function(){
            var total,
                _this = this;

            this.collection.each(function( category ){
                total = 0;
                category.get('feeds').each(function(feed){
                    total += feed.get('unread');
                });
                _this.$el.find("[data-id='" + category.get('_id') + "']").find(".categoryTab .unread").html(total);
            })
        },

        personalizeBtn: function(e){
            e.preventDefault();
            this.trigger('personalize');
        },

        showSavedPost: function(e){
            e.preventDefault();
            this.trigger('showSavedPost');  
        },

        changeSwitcher: function(e){
            e.preventDefault();
            e.stopPropagation();

            var $li = $(e.target).closest("li");

            if($li.hasClass("open")){
                $li.removeClass("open")
            }else{
                $li.addClass("open");
            }
        },

        showFeed: function(e){
            e.preventDefault();
            var $li = $(e.target).closest("li");
            var $tab = $li.find(".tab");
            this.removeAllActiveClass();
            $tab.addClass('active');
            this.trigger('showFeed', {_id: $li.data('id')});
        },

        showSavedFeed: function(e){
            e.preventDefault();
            e.stopPropagation();
            var $li = $(e.target).closest("li");
            var $tab = $li.find(".tab");
            this.removeAllActiveClass();
            $tab.addClass('active');
            this.trigger('showSavedFeed', {_id: $li.data('id')});
        },

        removeAllActiveClass: function(){
            this.$el.find('.active').removeClass('active');
        },

        setAllPostUnread: function(e){
            if(e) {
                e.preventDefault();
                e.stopPropagation();
            }

            var id = $(e.target).closest("li").data('id');
            if(!id) return false;

            this.trigger("isSetAllPostUnread", id);
        },

        changeUnread: function(model){
            var id = model.get('_id');
            this.$el.find("[data-id='" + id + "']").find(".unread").html(model.get('unread'));
            this.reRenderTotalUnreadPosts();
        },

        serializeData: function(){
            return {};
        }
    })

})
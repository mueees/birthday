define([
    'marionette',
    'text!../templates/CategoryView.html',
    '../views/FeedView'
], function(Marionette, template, FeedView){

    return Marionette.ItemView.extend({
        template: _.template(template),

        events: {

        },

        ui: {

        },

        className: "category",

        tagName: "li",

        initialize: function(){
            this.render();
            this.addDrop();
        },

        addDrop: function(){
            var _this = this;
            this.$el.find('.content').droppable({
                drop: function(event, ui){
                    _this.drop( event, ui, _this );
                },
                over: function( event, ui ) {
                    _this.over(event, ui, _this);
                },
                out: function( event, ui ) {
                    _this.out(event, ui, _this);
                }
            });
        },

        drop: function(event, ui, _this){

            _this.$el.removeClass("over");
        },

        over: function(event, ui, _this){
            _this.$el.addClass("over");
        },

        out: function(event, ui, _this){
            _this.$el.removeClass("over");
        },

        render: function(){
            var view = this.template(this.model.toJSON());
            this.$el.html(view);
            this.renderFeeds();
        },

        renderFeeds: function(){
            var _this = this;
            var feeds = this.model.get('feeds');
            feeds.each(function(feedModel){
                _this.renderFeed(feedModel)
            })
        },

        renderFeed: function(feedModel){
            var feedView = new FeedView({model: feedModel});
            this.$el.find('.content').append(feedView.$el);
        },

        serializeData: function(){
            return {}
        }
    })

})
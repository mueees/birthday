define([
    'marionette',
    'text!../templates/CategoryView.html',
    '../views/FeedView'
], function(Marionette, template, FeedView){

    return Marionette.ItemView.extend({
        template: _.template(template),

        events: {
            "click .deleteCategory": "deleteCategory",
            "click .editCategory": "editCategory"
        },

        ui: {

        },

        className: "category",

        tagName: "li",

        initialize: function(){
            this.render();
            this.addDrop();
            var feeds = this.model.get('feeds');

            this.listenTo(feeds, 'add', this.renderFeed);
            this.listenTo(feeds, 'remove', this.removeFeed);
            this.listenTo(this.model, 'destroy', this.close);
            this.listenTo(this.model, 'change:name', this.changeName);
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
            
            this.trigger("dropFeed", {
                targetCategory: _this.model,
                parentCategory: ui.draggable.data('parentCategory'),
                idFeed: ui.draggable.data('idFeed')
            })
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

            if( !feeds ) return false;

            feeds.each(function(feedModel){
                _this.renderFeed(feedModel)
            })
        },

        renderFeed: function(feedModel){
            var _this = this;
            var feedView = new FeedView({
                model: feedModel,
                parentCategory: _this.model
            });

            this.listenTo(feedView, 'deleteFeed', function(feedModel){
                _this.trigger('deleteFeed', feedModel);
            });
            this.listenTo(feedView, 'editFeed', function(feedModel){
                _this.trigger('editFeed', feedModel);
            });

            this.$el.find('.content').append(feedView.$el);
        },

        removeFeed: function(model){
            this.$el.find('#' + model.get('_id')).remove();
        },

        deleteCategory: function(e){
            e.preventDefault();

            if( this.model.get('feeds').length > 0 ){
                alert("Error! Please remove or replace feeds.");
                return false;
            }

            this.trigger('deleteCategory', this.model);
        },

        editCategory: function(e){
            e.preventDefault();
            this.trigger('editCategory', this.model);
        },

        changeName: function(){
            this.$el.find('.head .title').html( this.model.get('name') );
        },

        serializeData: function(){
            return {}
        }
    })

})
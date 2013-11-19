define([
    'marionette',
    'text!../templates/FeedView.html',
    'jqueryUi'
], function(Marionette, template){

    return Marionette.ItemView.extend({
        template: _.template(template),

        events: {
            'click .deleteFeed': 'deleteFeed',
            'click .editFeed': 'editFeed'
        },

        ui: {

        },

        tagName: 'li',

        className: "organize",

        initialize: function(options){
            this.parentCategory = options.parentCategory;
            this.listenTo(this.model, 'destroy', this.close);
            this.render();
            this.addDrag()
            this.setData();
        },

        render: function(){
            var _this = this;
            var view = this.template(this.model.toJSON());
            this.$el.html(view);
        },

        addDrag: function(){
            var _this = this;
            this.$el.draggable({
                appendTo: "body",
                helper: "clone"
            });
        },

        setData: function(){
            var _this = this;
            
            this.$el.attr('id', this.model.get('_id'));

            this.$el.data({
                idFeed: this.model.get('_id'),
                parentCategory: _this.parentCategory
            })
        },

        deleteFeed: function(e){
            e.preventDefault();
            this.trigger('deleteFeed', this.model);
        },

        editFeed: function(e){
            e.preventDefault();
            this.trigger('editFeed', this.model);
        },

        serializeData: function(){
            return {}
        }
    })

})
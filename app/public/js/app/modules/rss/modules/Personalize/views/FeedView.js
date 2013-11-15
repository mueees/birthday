define([
    'marionette',
    'text!../templates/FeedView.html',
    'jqueryUi'
], function(Marionette, template){

    return Marionette.ItemView.extend({
        template: _.template(template),

        events: {

        },

        ui: {

        },

        tagName: 'li',

        className: "organize",

        initialize: function(){
            this.render();
            this.addDrag()
        },

        render: function(){
            var view = this.template(this.model.toJSON());
            this.$el.html(view);
        },

        addDrag: function(){
            this.$el.draggable({
                appendTo: "body",
                helper: "clone",
                cursor: "pointer"
            });
        },

        serializeData: function(){
            return {}
        }
    })

})
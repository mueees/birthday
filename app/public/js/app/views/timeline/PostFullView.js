define([
    'marionette',
    'text!app/templates/timeline/PostFullView.html'
], function(Marionette, template){

    return Marionette.ItemView.extend({
        template: _.template(template),

        className: "modal fade postModal",

        events: {
            "click .next": "nextPost",
            "click .prev": "prevPost"
        },

        ui: {

        },

        initialize: function(){
            this.render();
        },

        prevPost: function(){
            this.$el.modal('hide');
            this.trigger("prevPost", {
                model: this.model
            });

            return false;
        },

        nextPost: function(){
            this.$el.modal('hide');
            this.trigger("nextPost", {
                model: this.model
            });

            return false;
        }
    })

})
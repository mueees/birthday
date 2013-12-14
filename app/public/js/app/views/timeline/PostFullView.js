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
            var _this = this;
            this.render();
            this.$el.on('hidden', function () {
                _this.$el.remove();
            })
        },

        prevPost: function(){
            this.hideAndRemove();
            this.trigger("prevPost", this.model);

            return false;
        },

        nextPost: function(){
            this.hideAndRemove();
            this.trigger("nextPost", this.model);
            return false;
        },

        hideAndRemove: function(){
            var _this = this;
            this.$el.modal('hide');
            setTimeout(function(){
                _this.close();
            }, 200);
        }

    })

})
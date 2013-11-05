define([
    'marionette',
    'text!../templates/PostList.html'
], function(Marionette, template){

    return Marionette.ItemView.extend({
        template: _.template(template),

        events: {
            "click": "checkPost"
        },

        tagName: "li",

        className: "rss_post list",

        ui: {

        },

        initialize: function(){
            this.render();
            this.$el.addClass( this.model.cid )
        },

        onRender: function(){

        },

        checkPost: function(){
            this.trigger("checkPost", this.model);
        }
    })

})
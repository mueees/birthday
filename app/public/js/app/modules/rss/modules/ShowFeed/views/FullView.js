define([
    'marionette',
    'text!../templates/FullView.html'
], function(Marionette, template){

    return Marionette.ItemView.extend({
        template: _.template(template),

        events: {
            "click .closeView": "closeView"
        },

        tagName: "li",

        className: "fullView rss_post",

        ui: {

        },

        initialize: function(){
            this.render();
            this.$el.addClass( this.model.cid );
        },

        onRender: function(){

        },

        closeView: function(){
            this.remove();
            this.trigger("closeFullView", this.model);
        }
    })

})
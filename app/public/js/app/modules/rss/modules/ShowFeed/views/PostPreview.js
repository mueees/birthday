define([
    'marionette',
    'text!../templates/PostPreview.html'
], function(Marionette, template){

    return Marionette.ItemView.extend({
        template: _.template(template),

        events: {
            "click": "checkPost"
        },

        tagName: "li",

        className: "rss_post previewView",

        ui: {

        },

        initialize: function(){
            this.render();
            this.sliceSummary();
            this.$el.addClass( this.model.cid )
        },

        sliceSummary: function(){
            var summary = this.model.get('summary');
            this.$el.find('.summary').html( summary.slice(0, 450) );
        },

        onRender: function(){

        },

        checkPost: function(){
            this.trigger("checkPost", this.model);
        }
    })

})
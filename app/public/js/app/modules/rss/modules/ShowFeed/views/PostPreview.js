define([
    'marionette',
    'text!../templates/PostPreview.html'
], function(Marionette, template){

    return Marionette.ItemView.extend({
        template: _.template(template),

        events: {
            "click": "checkPost",
            "click .readLater": "readLater"
        },

        tagName: "li",

        className: "rss_post previewView",

        ui: {

        },

        initialize: function(){
            this.render();
            this.sliceSummary();
            this.addImage();
            this.$el.addClass( this.model.cid )

            this.listenTo(this.model, "change:readLater", this.setReadLaterState);
        },

        sliceSummary: function(){
            var summary = this.model.get('summary');
            this.$el.find('.summary').html( summary.slice(0, 450) );
        },

        addImage: function(){
            
        },

        onRender: function(){

        },

        readLater: function(e){
            e.preventDefault();
            e.stopPropagation();
            if( this.model.get('readLater') ){
                this.model.unReadLater();
            }else{
                this.model.readLater();    
            }
        },

        setReadLaterState: function(){
            ( this.model.get('readLater') ) ? this.$el.find('.readLater').addClass('active') : this.$el.find('.readLater').removeClass('active');
        },

        checkPost: function(){
            this.trigger("checkPost", this.model);
        }
    })

})
define([
    'backbone',
    'marionette',
    'text!app/templates/timeline/PostPreviewView.html'
], function(Backbone, Marionette, template){

    return Marionette.ItemView.extend({
        template: _.template(template),

        tagName: "LI",

        className: "post",

        events: {
            "click": "previewClick"
        },

        ui: {

        },

        initialize: function(){
            this.render();
        },

        render: function(){
            var model = this.model.toJSON();
            var postPreviewView = this.template(model);
            this.$el.html(postPreviewView);
            this.$el.addClass(model.preset.classes);
            this.$el.css({
                width: model.preset.width,
                left: model.left
            });

            this.$el.attr( 'id', model._id );
        },

        onRender: function(){

        },

        getTitlePhoto: function(){
            this.$el.find('img').attr('src', this.model.get('previewImg') );
        },

        setLeft: function( left ){
            this.model.set('left', left);
            this.render();
        },

        getWidth: function(){
            var preset = this.model.get("preset");
            return preset.width;
        },

        previewClick: function(){
            this.trigger("showPost", {
                postModel: this.model
            });

            Backbone.history.navigate('/public/timeline/' + this.model.get('_id'));
            return false;
        }
    })

})
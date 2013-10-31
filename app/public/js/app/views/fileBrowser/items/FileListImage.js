define([
    'marionette',

    '../base/FileList'
], function(Marionette, FileList){

    return FileList.extend({

        tagName: "tr",

        events: {
            "click": "chooseView"
        },

        initialize: function(){
            FileList.prototype.initialize.apply(this);
            this.appendImg();
        },

        appendImg: function(){
            var path = this.model.get("path");
            this.$el.find('.link').append('<div class="previewCont" />')
            this.$el.find('.previewCont').append($('<img />', {
                src: path,
                class: "previewImg"
            }));


            this.$el.find(".name i").remove();

            this.$el.find('.name').prepend('<div class="smallPreviewCont" />')
            this.$el.find(".smallPreviewCont").append($('<img />', {
                src: path,
                class: "smallPreviewImg"
            }));

        }
    })

})
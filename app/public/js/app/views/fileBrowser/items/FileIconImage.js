define([
    'marionette',

    '../base/FileIcon'
], function(Marionette, FileIcon){

    return FileIcon.extend({

        events: {
            "click": "chooseView"
        },

        initialize: function(){
            FileIcon.prototype.initialize.apply(this);
            this.appendImg();
        },

        appendImg: function(){
            var path = this.model.get("path");
            this.$el.find('.iconCont').html("").append($('<img />', {
                src: path,
                class: "previewImg"
            }));
        }
    })

})
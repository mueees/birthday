define([
    'marionette',

    '../base/ItemBase'
], function(Marionette, ItemBase){

    return ItemBase.extend({

        tagName: "tr",

        events: {
            "click .fileName" : "fileName",
            "click": "chooseView"
        },

        ui: {

        },

        initialize: function(){
            this.render(this.model.toJSON());
            this.listenTo(this.model, "change:isActive", this.isActiveChange);
        },

        fileName: function(e){

        }
    })

})
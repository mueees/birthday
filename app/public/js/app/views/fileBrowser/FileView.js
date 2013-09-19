define([
    'marionette',
    'text!app/templates/fileBrowser/FileView.html',

    './base/ItemBase'
], function(Marionette, template, ItemBase){

    return ItemBase.extend({
        template: _.template(template),

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
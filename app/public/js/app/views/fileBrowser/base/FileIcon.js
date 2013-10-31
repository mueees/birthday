define([
    'marionette',
    'text!app/templates/fileBrowser/FileIcon.html',

    './ItemBase'
], function(Marionette, template, ItemBase){

    return ItemBase.extend({
        template: _.template(template),

        tagName: "li",

        events: {
            "click": "chooseView"
        },

        ui: {

        },

        initialize: function(){
            ItemBase.prototype.initialize.apply(this);
            
            this.render(this.model.toJSON());
            this.listenTo(this.model, "change:isActive", this.isActiveChange);
        }
    })

})
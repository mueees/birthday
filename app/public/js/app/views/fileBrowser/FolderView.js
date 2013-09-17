define([
    'marionette',
    'text!app/templates/fileBrowser/FolderView.html',

    /*views*/
    'app/views/fileBrowser/ItemBase'
], function(Marionette, template, ItemBase){

    return ItemBase.extend({
        template: _.template(template),

        events: {

        },

        tagName: "TR",

        className: "item folder",

        ui: {

        },

        initialize: function(){

        },

        onRender: function(){

        }
    })

})
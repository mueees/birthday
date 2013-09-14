define([
    'marionette',
    'text!app/templates/blog/listPost/OnePostView.html'
], function(Marionette, template){

    return Marionette.ItemView.extend({
        template: _.template(template),

        tagName: "TR",

        events: {

        },

        ui: {

        },

        initialize: function(){
            this.render();
        },

        onRender: function(){

        }
    })

})
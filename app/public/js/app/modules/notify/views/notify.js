define([
    'marionette',
    'text!../templates/template.html'
], function(Marionette, template){

    return Marionette.ItemView.extend({
        template: _.template(template),

        className: "notify",

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
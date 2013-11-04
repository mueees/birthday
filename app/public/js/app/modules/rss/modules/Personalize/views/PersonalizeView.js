define([
    'marionette',
    'text!../templates/PersonalizeView.html'
], function(Marionette, template){

    return Marionette.ItemView.extend({
        template: _.template(template),

        events: {

        },

        ui: {

        },

        initialize: function(){

        },

        onRender: function(){

        },

        serializeData: function(){
            return {}
        }
    })

})
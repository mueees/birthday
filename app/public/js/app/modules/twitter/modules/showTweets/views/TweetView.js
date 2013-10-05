define([
    'marionette',
    'text!../templates/Tweet.html'
], function(Marionette, template){

    return Marionette.ItemView.extend({
        template: _.template(template),

        tagName: "LI",

        className: "tweet",

        events: {

        },

        ui: {

        },

        initialize: function(){

            
            
        },

        onRender: function(){

        }
    })

})
define([
    'marionette',
    'text!../templates/Feeds.html'
], function(Marionette, template){

    return Marionette.ItemView.extend({
        template: _.template(template),

        events: {
            "click .personalize": "personalizeBtn"
        },

        className: "feedContent",

        ui: {

        },

        initialize: function(){

        },

        onRender: function(){

        },

        personalizeBtn: function(e){
            e.preventDefault();
            this.trigger('personalize');
        },

        serializeData: function(){
            return {}
        }
    })

})
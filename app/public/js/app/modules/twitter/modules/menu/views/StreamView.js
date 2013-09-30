define([
    'marionette',
    "text!../templates/StreamView.html"
], function(Marionette, template){

    return Marionette.ItemView.extend({

        template: _.template(template),

        events: {
            'click .addStream': 'addStream'
        },

        ui: {

        },

        initialize: function(options){
            this.channel = options.channel;
        },

        onRender: function(){

        },

        addStream: function(){
            this.channel.trigger("showAddStreamForm");
        }
    })

})
define([
    'marionette',
    'text!app/templates/timeline/LineView.html'
], function(Marionette, template){

    return Marionette.ItemView.extend({
        template: _.template(template),

        events: {

        },

        ui: {

        },

        initialize: function(data){

            this.yearsLine = [];
            this.monthLine = [];
            this.idsPost = [];

            this.init();


        },

        init: function(){

        },

        onRender: function(){

        }
    })

})
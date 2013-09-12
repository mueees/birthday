define([
    'marionette',
    'text!app/templates/timeline/TimeLineView.html',

    /*views*/
    'app/views/timeline/LineView'
], function(Marionette, template, LineView){

    return Marionette.ItemView.extend({
        template: _.template(template),

        events: {

        },

        ui: {

        },

        initialize: function(data){
            this.line = new LineView(data);
        },

        onRender: function(){

        }
    })

})
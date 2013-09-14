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

        render: function(){
            var view = this.template();
            this.$el.html(view);
            this.$el.find('.tl').append( this.line.$el );
            this.line.bindEvent();
        },

        onRender: function(){

        }
    })

})
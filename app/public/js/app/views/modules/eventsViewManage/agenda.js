define([
    'marionette',
    'text!app/templates/modules/eventsViewManage/agenda.html'
], function(Marionette, template){

    return Marionette.ItemView.extend({
        template: _.template(template),

        events: {

        },

        ui: {

        },

        initialize: function(data){

            this.dataTorender = data.dataTorender;

        },

        onRender: function(){

        },

        render: function(){
            var view = this.template({
                dataTorender: this.dataTorender
            });
            this.$el.html( view );
        }
    })

})
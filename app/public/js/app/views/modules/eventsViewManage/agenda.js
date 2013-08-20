define([
    'app/app',
    'marionette',
    'text!app/templates/modules/eventsViewManage/agenda.html'
], function(App, Marionette, template){

    return Marionette.ItemView.extend({
        template: _.template(template),

        events: {
            "click .eventsList .change": "changeEvent"
        },

        ui: {

        },

        initialize: function(data){
            this.dataTorender = data.dataTorender;
        },

        onRender: function(){

        },

        changeEvent: function( e ){
            if(e) e.preventDefault();

            var event = $(e.target).closest("li");
            var id = event.attr('data-rowid');

            App.channels.main.trigger(App.config.eventName.main.changeEvent, {
                idEvent: id
            });

            return false;
        },

        render: function(){
            var view = this.template({
                dataTorender: this.dataTorender
            });
            this.$el.html( view );
        }
    })

})
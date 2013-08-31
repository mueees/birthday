define([
    'marionette',
    'text!app/templates/task/ListOfTasks/oneTask.html'
], function(Marionette, template){

    return Marionette.ItemView.extend({
        template: _.template(template),

        events: {

        },

        ui: {
            title: ".title"
        },

        initialize: function(){
            this.render();
            this.focus();


            this.listenTo(this.model, "focusMe", this.focus);
        },

        focus: function(){
            this.ui.title.focus();
        }
    })

})
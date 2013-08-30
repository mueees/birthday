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
            this.focusToTitle()
        },

        focusToTitle: function(){
            debugger
            this.ui.title.focus();
        }
    })

})
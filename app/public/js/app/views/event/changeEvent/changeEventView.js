define([
    'marionette',
    'text!app/templates/event/changeEvent/changeEvent.html'
], function(Marionette, template){

    return Marionette.ItemView.extend({
        template: _.template(template),

        events: {
            "click .btnCancel": "btnCancel",
            "click .btnDelete": "btnDelete"
        },

        ui: {

        },

        initialize: function(){
        },

        onRender: function(){

        },

        btnDelete: function(e){
            if(e) e.preventDefault();
        },

        btnCancel: function(e){
            if(e) e.preventDefault();
            this.removeFromDom();
        },

        removeFromDom: function(){
            this.remove();
        }
    })

})
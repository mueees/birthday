define([
    'marionette',
    'text!app/templates/blog/listPost/filter.html'
], function(Marionette, template){

    return Marionette.ItemView.extend({
        template: _.template(template),

        className: "filter ",

        events: {

        },

        ui: {

        },

        initialize: function(){

        },

        onRender: function(){

        }
    })

})
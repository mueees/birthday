define([
    'marionette',
    'text!../templates/PostList.html'
], function(Marionette, template){

    return Marionette.ItemView.extend({
        template: _.template(template),

        events: {

        },

        tagName: "li",

        className: "rss_post list",

        ui: {

        },

        initialize: function(){
            this.render();
        },

        onRender: function(){

        }
    })

})
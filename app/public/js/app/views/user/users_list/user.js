define([
    'app/app',
    'marionette',
    'text!app/templates/user/users_list/oneUser.html'
], function( App, Marionette, template ){

    return Marionette.ItemView.extend({

        tagName: "li",

        template: _.template(template),

        events: {
            "click .delete": "deleteUser"
        },

        initialize: function(){
            this.listenTo(this.model, 'destroy', this.removeFromDom)
        },

        deleteUser: function( e ){
            if(e) e.preventDefault();
            this.model.destroy();
        },

        removeFromDom: function(){
            this.remove();
        }
    })

})
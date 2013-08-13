define([
    'marionette',
    'text!app/templates/user/users_list/oneUser.html'
], function( Marionette, template ){

    return Marionette.ItemView.extend({
        template: _.template(template),
        initialize: function(){}
    })

})
define([
    'marionette',
    'text!app/templates/user/users_list/layout.html'

], function(Marionette, LayoutTemp){


    var Layout = Marionette.Layout.extend({
        template: _.template(LayoutTemp)
    })

    return Layout;

})
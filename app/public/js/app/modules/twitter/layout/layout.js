define([
    'marionette',
    "text!../templates/layout.html"

], function(Marionette, LayoutTemp){
    var Layout = Marionette.Layout.extend({
        template: _.template(LayoutTemp),

        regions: {
            'listContainer': '.content-container',
            'extendContainer': '.extend-container',
            'menuContainer': '.menu-container'
        }
    })

    return Layout;

})
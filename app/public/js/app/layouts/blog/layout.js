define([
    'marionette',
    'text!app/templates/blog/layout.html'

], function(Marionette, LayoutTemp){
    var Layout = Marionette.Layout.extend({
        template: _.template(LayoutTemp),

        regions: {
            'contentContainer': '.content-container',
            'menuContainer': '.menu-container',
            'extendContainer': ".extend-container"
        }
    })

    return Layout;

})
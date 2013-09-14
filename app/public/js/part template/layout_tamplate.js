define([
    'marionette',
    'text!app/templates/...'

], function(Marionette, LayoutTemp){


    var Layout = Marionette.Layout.extend({
        template: _.template(LayoutTemp),

        regions: {
            'contentContainer': '.content-container',
            'menuContainer': '.menu-container'
        }
    })

    return Layout;

})
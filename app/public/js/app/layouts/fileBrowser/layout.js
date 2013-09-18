define([
    'marionette',
    'text!app/templates/fileBrowser/layout.html'

], function(Marionette, LayoutTemp){


    var Layout = Marionette.Layout.extend({
        template: _.template(LayoutTemp),

        regions: {
            'menu': '.menu',
            'path': '.path',
            'manageBtn': '.manageBtn',
            'explore': '.explore',
            'upload': '.upload'
        }
    })

    return Layout;

})
define([
    'marionette',
    'text!app/templates/task/layout.html'

], function(Marionette, LayoutTemp){
    var Layout = Marionette.Layout.extend({
        template: _.template(LayoutTemp),

        regions: {
            'listContainer': '.list-container',
            'menuContainer': '.menu-container'
        }
    })

    return Layout;

})
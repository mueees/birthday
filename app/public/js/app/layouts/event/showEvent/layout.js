define([
    'marionette',
    'text!app/templates/event/showEvent/layout.html'

], function(Marionette, LayoutTemp){


    var Layout = Marionette.Layout.extend({
        template: _.template(LayoutTemp),

        regions: {
            'header': '.header',
            'content': '.content',
            'edit': '.edit',
            'sidebarLeft': '.sidebarLeft',
            'sidebarRight': '.sidebarRight'
        }
    })

    return Layout;

})
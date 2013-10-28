define([
    'marionette',
    "text!../templates/layout.html"

], function(Marionette, LayoutTemp){
    var Layout = Marionette.Layout.extend({
        template: _.template(LayoutTemp),

        regions: {
            'menu': '.menu_rss',
            'tabCont': ".tabCont",
            'addCont': ".addCont",
            'header_rss': '.header',
            'main_rss': '.main'
        }
    })

    return Layout;

})
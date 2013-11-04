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
            'contentCont': '.contentCont',
            'header_rss': '.header',
            'main_rss': '.main_rss'
        }
    })

    return Layout;

})
define([
    'marionette',
    'text!app/templates/blog/listPost/layout.html'

], function(Marionette, LayoutTemp){


    var Layout = Marionette.Layout.extend({
        template: _.template(LayoutTemp),

        className: "postList",

        regions: {
            'postsContainer': '.posts',
            'filterContainer': '.filter'
        }
    })

    return Layout;

})
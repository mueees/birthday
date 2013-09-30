define([
    'marionette',
    "text!../templates/layout.html"

], function(Marionette, LayoutTemp){
    var Layout = Marionette.Layout.extend({
        template: _.template(LayoutTemp),

        regions: {
            'streamContainer': '.stream-container',
            'groupContainer': '.group-container'
        }
    })

    return Layout;

})
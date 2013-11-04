define([
    'marionette',
    'text!../templates/AddView.html'
], function(Marionette, template){

    return Marionette.ItemView.extend({
        template: _.template(template),

        events: {
            'blur .feed_url': "feedUrlChanged"
        },

        ui: {
            "feed_url": ".feed_url",
            "availableSource": ".availableSource",
        },

        initialize: function(){

        },

        onRender: function(){
            
        },

        feedUrlChanged: function(e){
            if(e) e.preventDefault();
            var value = $.trim(this.ui.feed_url.val());
            if( !value ) {
                this.model.defaults();
                return false;
            }

            this.model.set('feed_url', value);
        },

        clearAvailableSource: function(){
            this.ui.availableSource.html("");
        }
    })

})
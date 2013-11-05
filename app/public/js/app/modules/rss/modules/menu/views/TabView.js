define([
    'marionette',
    'text!../templates/TabView.html'
], function(Marionette, template){

    return Marionette.ItemView.extend({
        template: _.template(template),

        events: {
            "click button": "buttonHandler"
        },

        ui: {
            'buttons': 'button'
        },

        initialize: function(){

        },

        onRender: function(){

        },

        buttonHandler: function(e){
            if(e) e.preventDefault();

            var $el = $(e.target);
            if( $el.hasClass('active') ) return false;

            this.ui.buttons.removeClass('active');
            $el.addClass('active');

            this.trigger('changeTab', $el.data('type'));
        }
    })

})
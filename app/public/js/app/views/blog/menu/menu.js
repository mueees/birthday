define([
    'marionette',
    'text!app/templates/blog/menu/menu.html'
], function(Marionette, template){

    return Marionette.ItemView.extend({
        template: _.template(template),

        events: {
            "click a[data-event]": "changeMenu"
        },

        ui: {

        },

        initialize: function(){

        },

        onRender: function(){

        },

        changeMenu: function(e){
            e.preventDefault();

            var $el = $(e.target),
                eventName = $el.data('event');

            if( !eventName ) return false;

            var $li = $el.parent(),
                $allLi = this.$el.find("li");

            this.trigger("changeMenu", {eventName:eventName});

            $allLi.removeClass("active");
            $li.addClass("active");

        }
    })

})
define([
    'app/app',
    'marionette',
    'text!app/templates/modules/tab_event_range/tab.html'
], function(App, Marionette, template){

    return Marionette.ItemView.extend({
        template: _.template(template),

        events: {
            "click .btn" : "btnClick"
        },

        ui: {
            "btn" : ".btn"
        },

        initialize: function(){

        },

        onRender: function(){

        },

        btnClick: function(e){
            var btn = $(e.target);
            if( this.isDisableBtn(btn) || this.isActive(btn) ) return false;

            var type = btn.attr('data-type');
            if( !type ) return false;

            App.channels.main.trigger( App.config.eventName.main.tabEventChanged, {
                type: type
            })

        },

        isDisableBtn: function(btn){
            return ( btn.hasClass('disabled') ) ? true : false;
        },

        isActive: function(btn){
            return ( btn.hasClass('active') ) ? true : false;
        },

        setTab: function( type ){
            type = this.filter(type);
            var btn = this.$el.find(".btn[data-type='"+type+"']");

            if( btn.length == 0 ){
                this.ui.btn.first().trigger("click");
            }else{
                btn.trigger("click");
            }
        },

        filter: function( value ){
            return value.toLowerCase();
        }
    })

})
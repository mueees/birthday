define([
    'marionette',
    'text!../templates/Feeds.html'
], function(Marionette, template){

    return Marionette.ItemView.extend({
        template: _.template(template),

        events: {
            "click .personalize": "personalizeBtn",
            "click .switcher": "changeSwitcher"
        },

        className: "feedContent",

        ui: {

        },

        initialize: function(options){
            this.collection = options.collection;
            this.render();
        },

        render: function(){
            var view = this.template({
                categories: this.collection.toJSON()
            });
            this.$el.html(view);
        },

        onRender: function(){

        },

        personalizeBtn: function(e){
            e.preventDefault();
            this.trigger('personalize');
        },

        changeSwitcher: function(e){
            e.preventDefault();
            e.stopPropagation();

            var $li = $(e.target).closest("li");

            if($li.hasClass("open")){
                $li.removeClass("open")
            }else{
                $li.addClass("open");
            }
        },

        serializeData: function(){
            return {}
        }
    })

})
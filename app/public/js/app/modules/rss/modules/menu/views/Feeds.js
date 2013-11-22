define([
    'marionette',
    'text!../templates/Feeds.html'
], function(Marionette, template){

    return Marionette.ItemView.extend({
        template: _.template(template),

        events: {
            "click .personalize": "personalizeBtn",
            "click .showSavedPost": "showSavedPost",
            "click .switcher": "changeSwitcher",
            "click .categories .feeds li" : "showFeed",
            "click .categories .feeds li .saved" : "showSavedFeed"
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

        showSavedPost: function(e){
            e.preventDefault();
            this.trigger('showSavedPost');  
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

        showFeed: function(e){
            e.preventDefault();
            var $li = $(e.target).closest("li");
            var $tab = $li.find(".tab");
            this.removeAllActiveClass();
            $tab.addClass('active');
            this.trigger('showFeed', {_id: $li.data('id')});
        },

        showSavedFeed: function(e){
            e.preventDefault();
            e.stopPropagation();
            var $li = $(e.target).closest("li");
            var $tab = $li.find(".tab");
            this.removeAllActiveClass();
            $tab.addClass('active');
            this.trigger('showSavedFeed', {_id: $li.data('id')});
        },

        removeAllActiveClass: function(){
            this.$el.find('.active').removeClass('active');
        },
        serializeData: function(){
            return {}
        }
    })

})
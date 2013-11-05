define([
    'marionette',
    'text!../templates/AvailableView.html'
], function(Marionette, template){

    return Marionette.ItemView.extend({

        template: _.template(template),

        tagName: "ul",

        className: "availableSource",

        events: {
            "click .source": "chooseFeed",
            "click .addFeed": "addFeedBtn"
        },

        ui: {

        },

        initialize: function(options){
            this.collection = options.collection;
            this.render();
        },

        render: function(){
            var view = this.template({
                feeds: this.collection.toJSON()
            });
            this.$el.html(view);
        },

        chooseFeed: function(e){
            e.preventDefault();
            var $el = $(e.target).closest('li');
            var feed = this.collection.get( $el.data('cid') );

            if(!feed) return false;

            this.trigger("availableFeedSelected", feed);

        },

        addFeedBtn: function(e){
            e.preventDefault();
            e.stopPropagation();
            var $el = $(e.target).closest('li');
            var feed = this.collection.get( $el.data('cid') );

            if(!feed) return false;

            this.trigger("saveNewFeed", feed);
        }
    })

})
define([
    'marionette',
    'text!../templates/SaveNewFeedView.html'
], function(Marionette, template){

    return Marionette.ItemView.extend({

        template: _.template(template),

        events: {

        },

        className: "addNewFeed",

        ui: {

        },

        initialize: function(options){
            this.categories = options.categories;
            this.feed = options.feed;

            this.render();
        },

        render: function(){
            debugger
            var view = this.template({
                categories: this.categories.toJSON(),
                feed: this.feed.toJSON()
            });
            this.$el.html(view);
        }
    })

})
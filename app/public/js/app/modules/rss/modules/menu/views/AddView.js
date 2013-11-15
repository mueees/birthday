define([
    'marionette',
    'text!../templates/AddView.html',

    /*views*/
    './AvailableView'
], function(Marionette, template, AvailableView){

    return Marionette.ItemView.extend({
        template: _.template(template),

        events: {
            'blur .feed_url': "feedUrlBlur",
            "click .clearUrl": "clearUrl"
        },

        className: "addRss",

        ui: {
            "feed_url": ".feed_url",
            "availableSource": ".availableSource"
        },

        initialize: function(){
            this.listenTo(this.model, "change:feed_url", this.changeFeedUrl)
            this.listenTo(this.model, "change:feeds", this.feedsChanged)
        },

        onRender: function(){
            
        },

        feedUrlBlur: function(e){
            var _this = this;

            if(e) e.preventDefault();
            var value = $.trim(this.ui.feed_url.val());

            if( !value ) {
                this.model.set( this.model.defaults );
                return false;
            }

            this.model.set('feed_url', value);
            this.model.fetch({
                error: function(model, err){
                    _this.model.trigger("errorMessage", err.message);
                }
            })
        },

        changeFeedUrl: function(){
            var feedUrl = this.model.get('feed_url');
            this.ui.feed_url.val(feedUrl);
        },

        feedsChanged: function(){

            var feeds = this.model.get('feeds'),
                _this = this;

                //debugger

            if(this.availableView){
                this.availableView.close();
                //this.stopListening();
            }

            if( !feeds || !feeds.length ) return false;

            this.availableView = new AvailableView({collection: feeds});
            this.listenTo(this.availableView, "availableFeedSelected", function(feed){
                _this.trigger("availableFeedSelected", feed);
            })
            this.listenTo(this.availableView, "saveNewFeed", function(feed){
                _this.trigger("saveNewFeed", feed);
            })

            this.$el.append(this.availableView.$el);

        },

        clearUrl: function(){
            this.model.set({
                feed_url: "",
                feeds: null
            });
        }
    })

})
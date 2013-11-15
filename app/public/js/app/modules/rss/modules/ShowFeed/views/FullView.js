define([
    'marionette',
    'text!../templates/FullView.html'
], function(Marionette, template){

    return Marionette.ItemView.extend({
        template: _.template(template),

        events: {
            "click .closeView": "closeView",
            "click .keepUnread": "keepUnread",
            "click .readLater": "readLater"
        },

        tagName: "li",

        className: "fullView rss_post",

        ui: {

        },

        initialize: function(){
            var _this = this;
            this.render();
            this.$el.addClass( this.model.cid );
            this.timeAgoTimer = setInterval( function(){_this.calculateTimeAgo()}, 1000 );

            this.listenTo(this.model, "change:readLater", this.setReadLaterState);

            this.calculateTimeAgo();
        },

        calculateTimeAgo: function(){
            this.$el.find('.timeAgo').html( this.getTimeAgo() );
        },

        getTimeAgo: function(){
            
            var postDate = new Date(this.model.get('date'));

            var currentDate = new Date();
            var data = currentDate - postDate;
            var duration = moment.duration(data);

            if(data < 0){
                return "now"
            }


            var day = duration.days();
            var hours = duration.hours();
            var minutes = duration.minutes();
            var seconds = duration.seconds();

            if( day ){
                return day + " day"
            }else if( hours ){
                return hours + " h"
            }else if( minutes ){
                return minutes + " min"
            }else if( seconds ){
                return seconds + " sec"
            }
        },

        onRender: function(){

        },

        keepUnread: function(e){
            e.preventDefault();
            var _this = this;
            this.model.setUnRead();
            this.closeView();
        },

        readLater: function(e){
            e.preventDefault();
            e.stopPropagation();
            if( this.model.get('readLater') ){
                this.model.unReadLater();
            }else{
                this.model.readLater();    
            }
        },

        setReadLaterState: function(){
            ( this.model.get('readLater') ) ? this.$el.find('.readLater').addClass('active') : this.$el.find('.readLater').removeClass('active');
        },

        closeView: function(){
            this.remove();
            this.trigger("closeFullView", this.model);
        }
    })

})
define([
    'marionette',
    'text!../templates/PostList.html',
    'moment'
], function(Marionette, template, moment){

    return Marionette.ItemView.extend({
        template: _.template(template),

        events: {
            "click": "checkPost"
        },

        tagName: "li",

        className: "rss_post list",

        ui: {

        },

        initialize: function(){
            var _this = this;
            this.render();
            this.$el.addClass( this.model.cid )
            this.timeAgoTimer = setInterval( function(){_this.calculateTimeAgo()}, 1000 );

            this.setIsReadClass();
            this.calculateTimeAgo();
        },

        setIsReadClass: function(){
            ( !this.model.get('isRead') ) ? this.$el.addClass('new') : '';
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

        dataFormat : function(format, data){
                var formatedData,
                    duration,
                    DATA_TYPE_TIME = "time",
                    DATA_TYPE_NUMBER = "number";


                switch(format){
                    case DATA_TYPE_TIME:
                        duration = moment.duration(data);
                        formatedData = (duration.hours() < 10 ? "0" +  duration.hours() :  duration.hours()) + ":"
                            + (duration.minutes() < 10 ? "0" +  duration.minutes() :  duration.minutes()) + ":"
                            + (duration.seconds() < 10 ? "0" +  duration.seconds() :  duration.seconds());
                        break;
                    case DATA_TYPE_NUMBER:
                        formatedData = this.addComma(data);
                        break ;
                    default:
                }

                return formatedData;
            },

        onRender: function(){

        },

        checkPost: function(){
            this.trigger("checkPost", this.model);
        }
    })

})
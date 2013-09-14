define([
    'marionette',
    'text!app/templates/timeline/MonthView.html'
], function(Marionette, template){

    return Marionette.ItemView.extend({
        template: _.template(template),

        className: "month",

        events: {

        },

        ui: {

        },

        initialize: function(data){
            this.month = data.month;
            this.year = data.year;
            this.channel = data.channel;
            this.postPreviewView = [];
            this.width = null;
            this.left = null;
            this.visible = false;
        },

        render: function(){
            var _this = this;
            var monthView = this.template({
                month: this.month,
                year: this.year
            });
            this.$el.html(monthView);
            this.$el.addClass(this.year + '-' + this.month);
            this.$el.css({
                width: this.width
            })

            this.$posts = this.$el.find(".posts");

            _.each(this.postPreviewView, function(postPreviewView, i){
                _this.$posts.append(postPreviewView.$el);
            });
        },

        onRender: function(){

        },

        addPostView: function(postView){
            var _this = this;

            this.listenTo(postView, "showPost", function(data){
                data.monthLeft = _this.left;
                _this.channel.trigger("showPost", data)
            })

            this.postPreviewView.push(postView);
        },

        setLeft: function(left){
            this.left = left;
            this.right = left + this.width;
            this.$el.css({
                left: this.left
            })
        },

        setVisible: function(value){
            this.visible = value;
            if( this.visible && !this.postGetTitlePhoto ){
                this.postGetTitlePhoto = true;
                this.requestTitlePhoto();
            }
        },

        requestTitlePhoto: function(){

            _.each(this.postPreviewView, function(postPreviewView, i){
                postPreviewView.getTitlePhoto();
            })

        },

        calculate: function(){
            var _this = this,
                leftPos = 0;

            _.each(_this.postPreviewView, function( postPreviewView, i ){
                postPreviewView.setLeft( leftPos );
                leftPos += 1*postPreviewView.getWidth() + 20;
            })

            this.width = leftPos;
        },

        getWidth: function(){
            return this.width;
        }
    })

})
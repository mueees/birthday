define([
    'marionette',
    'text!app/templates/timeline/LineView.html',

    /*views*/
    'app/views/timeline/MonthView',
    'app/views/timeline/PostPreviewView',

    /*models*/
    'app/models/timeline/post',

    /*collections*/
    'app/collections/timeline/posts'

], function(Marionette, templateLine, MonthView, PostPreviewView, PostModel, PostCollection){

    return Marionette.ItemView.extend({
        templateLine: _.template(templateLine),

        className: "line",

        events: {
            /*"mousedown": function(e){debugger}*/
        },

        ui: {

        },

        initialize: function(data){



            this.rowPostData = data.rowPostData;
            this.channel = data.channel;

            this.yearsLine = [];
            this.monthLine = [];
            this.idsPost = [];
            this.width = null;
            this.left = 0;
            this.w = jQuery(window);
            this.windowWidth = this.w.width();

            this.createMonthView();
            this.calculateMonth();
            this.setLeftPosMonth();
            this.render();

        },

        bindEvent: function(){
            this.bindChangeLeft();
            this.bindResize();
            this.updateMonth();
            this.bindMouse();
        },

        render: function(){

            var _this = this;

            var lineView = this.templateLine();
            this.$el.html(lineView);

            this.$clip = this.$el.find(".timeline-clip");
            this.$buffer = this.$el.find(".timeline-buffer");

            this.$clip.css({
                width: this.width
            })


            _.each(this.monthLine, function(monthView, i){
                monthView.render();
                _this.$buffer.append( monthView.$el );
            })

        },

        createMonthView: function(){
            var years = this.rowPostData['years'],
                year,
                currentYear,
                month,
                currentMonth,
                monthView;

            for(year in years){
                currentYear = years[year];

                /*перебираем все месяца*/
                for( month in currentYear["month"] ){
                    currentMonth = currentYear["month"][month];
                    monthView =  new MonthView({
                        year: year,
                        month: month
                    });

                    this.createPosts(monthView,currentMonth['postData']);

                    monthView.calculate();
                    this.monthLine.push( monthView );

                }
            }
        },

        createPosts: function(monthView, posts){

            var post,
                modelPost,
                postCollection,
                postView;

            postCollection = new PostCollection();

            for( post in posts ){
                modelPost = new PostModel(posts[post]);
                postCollection.push(modelPost);

                postView = new PostPreviewView({model: modelPost});

                monthView.addPostView(postView);
            }
        },

        calculateMonth: function(){
            var _this = this;
            _.each(_this.monthLine, function(monthView, i){
                monthView.calculate();
            })
        },

        setLeftPosMonth: function(){
            var _this = this,
                left = 0;

            _.each(_this.monthLine, function(monthView, i){
                monthView.setLeft( left );
                left += monthView.getWidth();
            })

            this.width = left;
        },

        bindResize: function(){
            var _this = this;
            this.w.on('resize', function(){
                _this.resizeWindow();
            });
            this.updateMonth();
            return false;
        },

        resizeWindow: function(){
            this.windowWidth = this.w.width();
        },

        bindChangeLeft: function(){
            this.channel.on("timeline_left:change", this.changeLeftPosition, this);
        },

        changeLeftPosition: function(data){
            var left = data.left,
                type = null;

            this.$clip.css({
                left: left
            });

            this.left = left;
            this.updateMonth();
        },

        bindMouse: function(){
            var _this = this;
            this.dragObj = null;
            this.intervalImpuls = null;

            this.$el.on("mousedown", function(e){
                _this.mousedown(e, _this)
            });
            this.$el.on("mousemove", function(e){
                _this.mousemove(e, _this)
            });
            $(document).on("mouseup", function(e){
                _this.mouseUp(e, _this);
            });

        },

        mousedown: function(e, _this){

            _this.dragObj =  {};

            _this.dragObj.downX = e.pageX;
            _this.dragObj.currentLeft = _this.left;
            _this.dragObj.inert = [];
            clearInterval(_this.intervalImpuls);

            return false;
        },

        mousemove: function(e, _this){
            if( !_this.dragObj || !_this.dragObj.downX ) return false;

            var moveX = e.pageX - _this.dragObj.downX;
            if( Math.abs(moveX) < 3 ) return false;

            moveX = _this.dragObj.currentLeft + moveX;

            /*если драг дошел до левого конца, то движение должено прекратиться*/
            if( moveX > 0 ) return false;
            /*если драг дошел до правого конца, то движение должено прекратиться*/
            if( Math.abs( moveX ) + _this.windowWidth > _this.width ) return false;

            if( moveX > _this.windowWidth + Math.abs(_this.dragObj.moveX)) return false;
            if( Math.abs(moveX) < 20 ){
                moveX = 0;
            }
            _this.dragObj.moveX = moveX;

            _this.channel.trigger("timeline_left:change", {left: _this.dragObj.moveX});

            return false;

        },

        mouseUp: function(e, _this){
            _this.dragObj = null;
        },

        updateMonth: function(){

            var _this = this,
                startPos = -1 * this.left,
                endPos = startPos + this.windowWidth;

            _.each(this.monthLine, function( monthView, i ){

                if( monthView.left <= endPos &&
                    monthView.right >= startPos
                    ){
                    monthView.setVisible(true);
                    monthView.$el.appendTo(_this.$clip);
                }else{
                    monthView.$el.appendTo(_this.$buffer);
                    monthView.setVisible(false);
                }
            })

        }

    })

})
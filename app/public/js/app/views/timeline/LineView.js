define([
    'marionette',
    'text!app/templates/timeline/LineView.html',

    /*views*/
    'app/views/timeline/MonthView',
    'app/views/timeline/PostPreviewView',
    'app/views/timeline/PostFullView',

    /*models*/
    'app/models/timeline/post',

    /*collections*/
    'app/collections/timeline/posts',

    'bootstrap'

], function(Marionette, templateLine, MonthView, PostPreviewView, PostFullView, PostModel, PostCollection){

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

            this.listenTo(this.channel, "showPost", this.showPost);

            this.createMonthView();
            this.calculateMonth();
            this.setLeftPosMonth();
            this.render();

        },

        showPost: function(data){

            var postModel = data.postModel.toJSON();

            var newLeftPos = (-data.monthLeft - postModel.left) + this.windowWidth/2 - postModel.preset.width/2;

            if( newLeftPos > 0 ){
                newLeftPos = 0;

                /*если импульс дошел до правого конца, то импульс должен прекратиться*/
            }else if( Math.abs( newLeftPos - this.windowWidth ) > this.width ){
                newLeftPos = -(this.width - this.windowWidth);
            }

            this.channel.trigger('timeline_left:change', {
                left: newLeftPos,
                type: "animate"
            });

            this.showFullPost({model: data.postModel});

        },

        showFullPost: function(data){
            var fullPost = new PostFullView(data);
            fullPost.$el.modal();

            /*this.listenTo(fullPost, "nextPost", function(data){
                this.channel("showNextPost", data);
            });*/

        },

        showNextPost: function(){

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
                        month: month,
                        channel: this.channel
                    })

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
                type = data.type;


            if( type === 'animate' ){
                this.$clip.animate({
                    left: left
                }, 500);
            }else{
                this.$clip.css({
                    left: left
                });
            }

            this.left = left;
            this.updateMonth();
        },

        bindMouse: function(){
            var _this = this;
            this.dragObj = null;

            this.impulsOption = {
                timeInter: 20, //кол-во последних миллисекунд которые берутся в расчет для расчета инерции
                mass: 5, // коэффициент служит для расчета инерции,
                fading: 1.05, //// коэффициент затухания инерции
                minImpuls: 0.1 // коэффициент при котором импульс прекращает действовать
            }

            this.impuls = null;

            this.intervalImpuls = null;

            this.$el.on("mousedown", function(e){
                e.preventDefault();
                _this.mousedown(e, _this);
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

            /*расчет для инерции*/
            _this.dragObj.startMoveTime = new Date();
            _this.dragObj.lastMoveX = e.pageX;
            _this.dragObj.inert.push({
                time: new Date(),
                position: Math.abs(moveX)
            })

            _this.channel.trigger("timeline_left:change", {left: _this.dragObj.moveX});

            return false;

        },

        mouseUp: function(e, _this){

            var curerntTime,
                lastPoint,
                startPoint;



            /*подсчитываем инерцию*/
            if( _this.dragObj != null && _this.dragObj.inert.length > 0 ){
                curerntTime = new Date();
                lastPoint = _this.dragObj.inert[ _this.dragObj.inert.length - 1];

                /*если мышка простояла более чем timeInter никуда не двигаюся то инерции не будет*/
                if( curerntTime - lastPoint.time  < _this.impulsOption.timeInter ){
                    startPoint = (function(){

                        var time = 0,
                            i = _this.dragObj.inert.length - 1;

                        while( time < _this.impulsOption.timeInter && i > 0 ){
                            time = lastPoint.time - _this.dragObj.inert[i].time;
                            i--;
                        }

                        if( time >= _this.impulsOption.timeInter ){
                            return _this.dragObj.inert[i]
                        }

                        return false;

                    })();

                    if( startPoint ){
                        var startPosition = startPoint.position;
                        var endPosition = lastPoint.position;
                        var startTime = startPoint.time;
                        var endTime = lastPoint.time;

                        var distance = endPosition - startPosition;
                        var time = endTime - startTime;
                        var speed = distance/time;
                        _this.impuls = speed * _this.impulsOption.mass;

                        _this.intervalImpuls = setInterval(function(){_this.impulsStart()}, 16);

                    }
                }
            }


            _this.dragObj = null;
            return false;
        },

        impulsStart: function(){
            var left = this.left - this.impuls;

            /*если импульс дошел до левого конца, то импульс должен прекратиться*/
            if( left > 0 ){
                this.channel.trigger("timeline_left:change", {left: 0} );
                clearInterval(this.intervalImpuls);
                return false;
            }

            /*если импульс дошел до правого конца, то импульс должен прекратиться*/
            if( Math.abs( left - this.windowWidth ) > this.width ){
                this.channel.trigger("timeline_left:change", {left: left} );
                clearInterval(this.intervalImpuls);
                return false;
            }

            /*если все нормально вещаем новую позицию left и уменьшаем импульс*/
            this.channel.trigger("timeline_left:change", {left: this.left - this.impuls} );
            this.impuls = this.impuls / this.impulsOption.fading;
            if( Math.abs(this.impuls) < this.impulsOption.minImpuls ) clearInterval(this.intervalImpuls);
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
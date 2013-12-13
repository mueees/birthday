(function(b, mediator){


    var lang = GLOBAL_VAIRABLE.lang || "ru";

    function TimeLineManager(){

        this.init = function (){
            $.ajax({
                type: "POST",
                url: "/" + lang + "/ajaxPost/getAllPosts",
                success: getPostSuccess,
                error: function(){
                    alert("Error, please try again");
                }
            })
        }

        function getPostSuccess(data){

            var posts = JSON.parse(data);
            posts = posts.message;
            var postData;

            if(posts.length == 0) {
                alert("Sorry, we don't have posts");
                return false;
            }
            new TimeLine( parse(posts) );
        }
        function parse( posts ){

            var result = {
                    years: {}
                },
                i,
                max = posts.length,
                post,
                dateCreate;

            for( i = 0; i < max; i++ ){
                post = posts[i];
                dateCreate = parseDate( post["date_create"] );
                post['dateCreate'] = dateCreate;

                /*ÑÐ¾Ð·Ð´Ð°ÐµÐ¼ Ð³Ð¾Ð´, ÐµÑÐ»Ð¸ Ñ‚Ð°ÐºÐ¾Ð³Ð¾ ÐµÑ‰Ðµ Ð½ÐµÑ‚*/
                if( !result.years[ dateCreate.year ] ){
                    result.years[ dateCreate.year ] = {
                        month: {}
                    };
                }

                /*ÑÐ¾Ð·Ð´Ð°ÐµÐ¼ Ð¼ÐµÑÑÑ†, ÐµÑÐ»Ð¸ Ñ‚Ð°ÐºÐ¾Ð³Ð¾ ÐµÑ‰Ðµ Ð½ÐµÑ‚*/
                if( !result.years[ dateCreate.year ].month[dateCreate.month] ){
                    result.years[ dateCreate.year ].month[dateCreate.month] = {
                        postData: {}
                    }
                }
                result.years[ dateCreate.year ].month[dateCreate.month].postData[ post["id"] ] = post;
            }

            return result;

        }
        function parseDate( date_create ){
            var reg = /^(\d\d\d\d)-(\d\d)-(\d\d)\s*(\d\d):(\d\d):(\d\d)/;
            var dataCreate = date_create.match(reg);
            return {
                year: dataCreate[1] * 1,
                month: dataCreate[2] * 1,
                day: dataCreate[3] * 1,
                hour: dataCreate[4] * 1,
                minute: dataCreate[5] * 1,
                second: dataCreate[6] * 1
            }

        }

    }

    function TimeLine( postData ){

        var line = new Line( postData),
            html,
            left = 0;


        mediator.subscribe("line_left:change", changeLeft);
        function changeLeft(data){
            left = data.left;
            var type = null;
            if( data.type != "undefined" ){
                type = data.type;
            }

            mediator.publish("timeline_left:change", {
                left: left,
                type: type
            });
        }

        function init(){
            var timeLineView = new TimeLineView();
            html = timeLineView.getHtml();
            html.append( line.html );

            $('body').append(html);

            hash.parseHash();
        }
        init();
    }
    function TimeLineView(){
        var template = Handlebars.compile( jQuery(".h_timeLine").html() );
        var html = render();

        function render(){
            var html = template();
            html = html.replace(/^[ \s]+/gm, '');
            html = $( html );
            return html;
        }
        this.getHtml = function(){
            return html;
        }

    }


    function Line( postData ){

        var self = this;
        var monthLine = [];
        var yearsLine = [];
        var idsPost = [];
        var template = Handlebars.compile( jQuery(".timeLine_Line").html() );
        var w = jQuery(window);
        var windowWidth = w.width();

        self.html = null;
        self.clip = null;
        self.buffer = null;
        self.width = null;
        self.left = 0;

        function generateHtml(){
            var html = template({
                years: yearsLine
            });
            html = html.replace(/^[ \s]+/gm, '');
            html = $( html );


            var clip = html.find('.timeline-clip');
            var buffer = html.find('.timeline-buffer');

            clip.css({
                left: self.left,
                position: 'absolute',
                height: 370,
                zIndex: 1,
                width: self.width
            });


            /*Ð²ÑÑ‚Ð°Ð²Ð»ÑÐµÐ¼ Ð² Ð±ÑƒÑ„ÐµÑ€ Ð¼ÐµÑÑÑ†Ñ‹*/
            //todo Ð·Ð°Ð¼ÐµÐ½Ð¸Ñ‚ÑŒ clip Ð½Ð° buffer
            var i, max = monthLine.length;
            for( i = 0; i < max; i++ ){
                buffer.append(monthLine[i].html);
            }

            return html;
        }
        function bind(){
            bindMouse();
            bindChangeLeft();
            bindResize();
            prepareToShowPost();
            nextPrevPost();
        }

        /*Ð¾Ð¿Ñ€ÐµÐ´ÐµÐ»ÑÐµÑ‚ Ð¿ÐµÑ€ÐµÑ‚Ð°ÑÐºÐ¸Ð²Ð°Ðµ Ð¼Ñ‹ÑˆÐ¸ + Ð¸Ð½ÐµÑ€Ñ†Ð¸ÑŽ*/
        function bindMouse(){

            var dragObj = null, // Ð¾Ð±ÑŠÐµÐºÑ‚ Ð¿ÐµÑ€ÐµÑ‚Ð°ÑÐºÐ¸Ð²Ð°Ð½Ð¸Ñ
                timeInter = 20, //ÐºÐ¾Ð»-Ð²Ð¾ Ð¿Ð¾ÑÐ»ÐµÐ´Ð½Ð¸Ñ… Ð¼Ð¸Ð»Ð»Ð¸ÑÐµÐºÑƒÐ½Ð´ ÐºÐ¾Ñ‚Ð¾Ñ€Ñ‹Ðµ Ð±ÐµÑ€ÑƒÑ‚ÑÑ Ð² Ñ€Ð°ÑÑ‡ÐµÑ‚ Ð´Ð»Ñ Ñ€Ð°ÑÑ‡ÐµÑ‚Ð° Ð¸Ð½ÐµÑ€Ñ†Ð¸Ð¸
                mass = 5, // ÐºÐ¾ÑÑ„Ñ„Ð¸Ñ†Ð¸ÐµÐ½Ñ‚ ÑÐ»ÑƒÐ¶Ð¸Ñ‚ Ð´Ð»Ñ Ñ€Ð°ÑÑ‡ÐµÑ‚Ð° Ð¸Ð½ÐµÑ€Ñ†Ð¸Ð¸
                fading = 1.05, // ÐºÐ¾ÑÑ„Ñ„Ð¸Ñ†Ð¸ÐµÐ½Ñ‚ Ð·Ð°Ñ‚ÑƒÑ…Ð°Ð½Ð¸Ñ Ð¸Ð½ÐµÑ€Ñ†Ð¸Ð¸
                minImpuls = 0.1, // ÐºÐ¾ÑÑ„Ñ„Ð¸Ñ†Ð¸ÐµÐ½Ñ‚ Ð¿Ñ€Ð¸ ÐºÐ¾Ñ‚Ð¾Ñ€Ð¾Ð¼ Ð¸Ð¼Ð¿ÑƒÐ»ÑŒÑ Ð¿Ñ€ÐµÐºÑ€Ð°Ñ‰Ð°ÐµÑ‚ Ð´ÐµÐ¹ÑÑ‚Ð²Ð¾Ð²Ð°Ñ‚ÑŒ
                intervalImpuls, // Ð¿ÐµÑ€ÐµÐ¼ÐµÐ½Ð½Ð°Ñ Ð¸Ð½Ñ‚ÐµÑ€Ð²Ð°Ð»Ð° Ð¸Ð½ÐµÑ€Ñ†Ð¸Ð¸Ð¸
                impuls;     //Ð·Ð½Ð°Ñ‡ÐµÐ½Ð¸Ðµ ÑÐ°Ð¼Ð¾Ð³Ð¾ Ð¸Ð¼Ð¿ÑƒÐ»ÑŒÑÐ°, ÐºÐ¾Ñ‚Ð¾Ñ€Ñ‹Ð¹ Ð·Ð°Ñ‚ÑƒÑ…Ð°ÐµÑ‚ Ñ ÐºÐ¾ÑÑ„Ñ„Ð¸Ñ†Ð¸ÐµÐ½Ñ‚Ð¾Ð¼ fading

            self.html.on("mousedown", mouseDown);
            self.html.on("mousemove", mouseMove);
            $(document).on("mouseup", mouseUp);

            function mouseDown(e){
                dragObj =  {};
                dragObj.downX = e.pageX;
                dragObj.currentLeft = self.left;
                dragObj.inert = [];
                clearInterval(intervalImpuls);

                return false;
            }
            function mouseMove(e){
                if( !dragObj || !dragObj.downX ) return false;
                var moveX = e.pageX - dragObj.downX;
                if( Math.abs(moveX) < 3 ) return false;

                moveX = dragObj.currentLeft + moveX;

                /*ÐµÑÐ»Ð¸ Ð´Ñ€Ð°Ð³ Ð´Ð¾ÑˆÐµÐ» Ð´Ð¾ Ð»ÐµÐ²Ð¾Ð³Ð¾ ÐºÐ¾Ð½Ñ†Ð°, Ñ‚Ð¾ Ð´Ð²Ð¸Ð¶ÐµÐ½Ð¸Ðµ Ð´Ð¾Ð»Ð¶ÐµÐ½Ð¾ Ð¿Ñ€ÐµÐºÑ€Ð°Ñ‚Ð¸Ñ‚ÑŒÑÑ*/
                if( moveX > 0) return false;
                /*ÐµÑÐ»Ð¸ Ð´Ñ€Ð°Ð³ Ð´Ð¾ÑˆÐµÐ» Ð´Ð¾ Ð¿Ñ€Ð°Ð²Ð¾Ð³Ð¾ ÐºÐ¾Ð½Ñ†Ð°, Ñ‚Ð¾ Ð´Ð²Ð¸Ð¶ÐµÐ½Ð¸Ðµ Ð´Ð¾Ð»Ð¶ÐµÐ½Ð¾ Ð¿Ñ€ÐµÐºÑ€Ð°Ñ‚Ð¸Ñ‚ÑŒÑÑ*/
                if( Math.abs( moveX ) + windowWidth > self.width ) return false;

                if( moveX > windowWidth + Math.abs(dragObj.moveX)) return false;
                dragObj.moveX = moveX;

                /*Ñ€Ð°ÑÑ‡ÐµÑ‚ Ð´Ð»Ñ Ð¸Ð½ÐµÑ€Ñ†Ð¸Ð¸*/
                dragObj.startMoveTime = new Date();
                dragObj.lastMoveX = e.pageX;
                dragObj.inert.push({
                    time: new Date(),
                    position: Math.abs(moveX)
                })


                mediator.publish("line_left:change", {left: dragObj.moveX});
                return false;

            }
            function mouseUp(e){

                /*Ð¿Ð¾Ð´ÑÑ‡Ð¸Ñ‚Ñ‹Ð²Ð°ÐµÐ¼ Ð¸Ð½ÐµÑ€Ñ†Ð¸ÑŽ*/
                if( dragObj != null ){
                    if( dragObj.inert.length > 0 ){
                        var curerntTime = new Date();
                        var lastPoint = dragObj.inert[ dragObj.inert.length - 1];

                        /*ÐµÑÐ»Ð¸ Ð¼Ñ‹ÑˆÐºÐ° Ð¿Ñ€Ð¾ÑÑ‚Ð¾ÑÐ»Ð° Ð±Ð¾Ð»ÐµÐµ Ñ‡ÐµÐ¼ timeInter Ð½Ð¸ÐºÑƒÐ´Ð° Ð½Ðµ Ð´Ð²Ð¸Ð³Ð°ÑŽÑÑ Ñ‚Ð¾ Ð¸Ð½ÐµÑ€Ñ†Ð¸Ð¸ Ð½Ðµ Ð±ÑƒÐ´ÐµÑ‚*/
                        if( curerntTime - lastPoint.time < timeInter ){
                            var startPoint = (function(){

                                var time = 0,
                                    i = dragObj.inert.length - 1;

                                while( time < timeInter && i > 0 ){
                                    time = lastPoint.time - dragObj.inert[i].time;
                                    i--;
                                }

                                if( time >= timeInter ){
                                    return dragObj.inert[i]
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
                                impuls = speed * mass;

                                intervalImpuls = setInterval(impulsStart, 16);

                            }
                        }

                    }
                }


                dragObj = null;
            }
            /*Ñ„ÑƒÐ½ÐºÑ†Ð¸Ñ Ñ€Ð°ÑÑ‡ÐµÑ‚Ð° ÑÐ¼ÐµÑ‰ÐµÐ½Ð¸Ñ Ð¿Ð¾Ð·Ð¸Ñ†Ð¸Ð¸ left Ð² Ñ€ÐµÐ·ÑƒÐ»ÑŒÑ‚Ð°Ñ‚Ðµ Ñ€Ð°Ð±Ð¾Ñ‚Ñ‹ Ð¸Ð¼Ð¿ÑƒÐ»ÑŒÑÐ°
             * Ð¾Ð³Ñ€Ð°Ð½Ð¸Ñ‡Ð¸Ð²Ð°ÐµÑ‚ Ð´Ð²Ð¸Ð¶ÐµÐ½Ð¸Ðµ left ÐµÑÐ»Ð¸ Ð¾Ð½Ð¾ Ð·Ð°ÑˆÐ»Ð¾ ÑÐ»Ð¸ÑˆÐºÐ¾Ð¼ Ð´Ð°Ð»ÐµÐºÐ¾
             * */
            function impulsStart(){

                var left = self.left - impuls;

                /*ÐµÑÐ»Ð¸ Ð¸Ð¼Ð¿ÑƒÐ»ÑŒÑ Ð´Ð¾ÑˆÐµÐ» Ð´Ð¾ Ð»ÐµÐ²Ð¾Ð³Ð¾ ÐºÐ¾Ð½Ñ†Ð°, Ñ‚Ð¾ Ð¸Ð¼Ð¿ÑƒÐ»ÑŒÑ Ð´Ð¾Ð»Ð¶ÐµÐ½ Ð¿Ñ€ÐµÐºÑ€Ð°Ñ‚Ð¸Ñ‚ÑŒÑÑ*/
                if( left > 0 ){
                    mediator.publish("timeline_left:change", {left: 0} );
                    clearInterval(intervalImpuls);
                    return false;
                }

                /*ÐµÑÐ»Ð¸ Ð¸Ð¼Ð¿ÑƒÐ»ÑŒÑ Ð´Ð¾ÑˆÐµÐ» Ð´Ð¾ Ð¿Ñ€Ð°Ð²Ð¾Ð³Ð¾ ÐºÐ¾Ð½Ñ†Ð°, Ñ‚Ð¾ Ð¸Ð¼Ð¿ÑƒÐ»ÑŒÑ Ð´Ð¾Ð»Ð¶ÐµÐ½ Ð¿Ñ€ÐµÐºÑ€Ð°Ñ‚Ð¸Ñ‚ÑŒÑÑ*/
                if( Math.abs( left - windowWidth ) > self.width ){
                    mediator.publish("timeline_left:change", {left: left} );
                    clearInterval(intervalImpuls);
                    return false;
                }

                /*ÐµÑÐ»Ð¸ Ð²ÑÐµ Ð½Ð¾Ñ€Ð¼Ð°Ð»ÑŒÐ½Ð¾ Ð²ÐµÑ‰Ð°ÐµÐ¼ Ð½Ð¾Ð²ÑƒÑŽ Ð¿Ð¾Ð·Ð¸Ñ†Ð¸ÑŽ left Ð¸ ÑƒÐ¼ÐµÐ½ÑŒÑˆÐ°ÐµÐ¼ Ð¸Ð¼Ð¿ÑƒÐ»ÑŒÑ*/
                mediator.publish("timeline_left:change", {left: self.left - impuls} );
                impuls = impuls / fading;
                if( Math.abs(impuls) < minImpuls ) clearInterval(intervalImpuls);
            }
        }
        function bindChangeLeft(){
            mediator.subscribe("timeline_left:change", changeLeftPosition);
            function changeLeftPosition(data){

                var left = data.left,
                    type = null;

                if( data.type != "undefined" ){
                    type = data.type;
                }

                if( type === 'animate' ){
                    self.clip.animate({
                        left: left
                    }, 500);
                }else{
                    self.clip.css({
                        left: left
                    });
                }
                self.left = left;
                updateMonth();
            }
        }
        /*Ð¿ÐµÑ€Ð²Ð¾Ðµ ÑÑ€Ð°Ð±Ð°Ñ‚Ñ‹Ð²Ð°Ð½Ð¸Ðµ Ñ„ÑƒÐ½ÐºÑ†Ð¸Ð¸ Ð¿Ñ€Ð¾Ð¸ÑÑ…Ð¾Ð´Ð¸Ñ‚ Ð¿Ñ€Ð¸ Ð·Ð°Ð³Ñ€ÑƒÐ·ÐºÐµ ÑÑ‚Ñ€Ð°Ð½Ð¸Ñ†Ñ‹*/
        function bindResize(){
            w.on('resize', resizeWindow);
            function resizeWindow(){
                windowWidth = w.width();
            }
            updateMonth();
            return false;
        }
        function updateMonth(){
            var i,
                max = monthLine.length,
                currentMonth,
                startPosition = -1 * self.left,
                endPosition = startPosition + windowWidth;

            for( i = 0; i< max; i++ ){
                currentMonth = monthLine[i];

                if( currentMonth.left <= endPosition &&
                    currentMonth.right >= startPosition ){
                    currentMonth.setVisible(true);
                    currentMonth.html.appendTo(self.clip);
                }else{
                    currentMonth.html.appendTo(self.buffer);
                    currentMonth.setVisible(false);
                }
            }
        }
        function prepareToShowPost(){
            mediator.subscribe("LinePrepareToShowPost", linePrepareToShowPost);
            function linePrepareToShowPost( data ){
                var newLeftPos = (-data.month_left - data.post_left) + windowWidth/2 - data.post_width/2;
                if( newLeftPos > 0 ){
                    newLeftPos = 0
                }
                /*ÐµÑÐ»Ð¸ Ð¸Ð¼Ð¿ÑƒÐ»ÑŒÑ Ð´Ð¾ÑˆÐµÐ» Ð´Ð¾ Ð¿Ñ€Ð°Ð²Ð¾Ð³Ð¾ ÐºÐ¾Ð½Ñ†Ð°, Ñ‚Ð¾ Ð¸Ð¼Ð¿ÑƒÐ»ÑŒÑ Ð´Ð¾Ð»Ð¶ÐµÐ½ Ð¿Ñ€ÐµÐºÑ€Ð°Ñ‚Ð¸Ñ‚ÑŒÑÑ*/
                if( Math.abs( newLeftPos - windowWidth ) > self.width ){
                    newLeftPos = -(self.width - windowWidth);
                }
                mediator.publish('line_left:change', {
                    left: newLeftPos,
                    type: "animate"
                });
            }
        }
        function nextPrevPost(){
            mediator.subscribe('postNavEvent', postNavEvent);

            function postNavEvent( data ){
                var index = findIndex(data.id);
                var step;

                if( data.type == "prev" ){
                    step = 1;
                }else if( data.type == "next" ){
                    step = -1;
                }

                if( index != -1 && idsPost[index + step] ){
                    mediator.publish('showNextPost', idsPost[index + step].id);
                }
                return false;
            }


            function findIndex(id){
                var i, max = idsPost.length;
                for( i = 0; i < max ; i++ ){
                    if( idsPost[i].id == id ){
                        return i;
                        break;
                    }
                }
                return -1;
            }
        }

        function init(){
            /*ÑÐ¾Ð·Ð´Ð°ÐµÑ‚ Ð¾Ð±ÑŠÐµÐºÑ‚Ñ‹ Ð¿Ð¾ÑÑ‚Ð¾Ð² Ð¸ Ð¼ÐµÑÑÑ†ÐµÐ²*/
            var years = postData['years'],
                year,
                month,
                post,
                currentYear,
                currentMonth,
                currentPost,

                monthObj,
                postObj;

            /*Ð¿ÐµÑ€ÐµÐ±Ð¸Ñ€Ð°ÐµÐ¼ Ð²ÑÐµ Ð³Ð¾Ð´Ð°*/
            for( year in years ){
                currentYear = years[year];
                yearsLine.push(year);

                /*Ð¿ÐµÑ€ÐµÐ±Ð¸Ñ€Ð°ÐµÐ¼ Ð²ÑÐµ Ð¼ÐµÑÑÑ†Ð°*/
                for( month in currentYear["month"] ){
                    currentMonth = currentYear["month"][month];
                    monthObj =  new Month( year, month );

                    /*Ð¿ÐµÑ€ÐµÐ±Ð¸Ñ€Ð°ÐµÐ¼ Ð²ÑÐµ Ð¿Ð¾ÑÑ‚Ñ‹*/
                    for( post in currentMonth["postData"] ){
                        currentPost = currentMonth["postData"][post];
                        idsPost.push(currentPost);
                        postObj = new Post( currentPost );
                        postObj.calculate();
                        postObj.month_info.year = monthObj.year;
                        postObj.month_info.month = monthObj.month;
                        monthObj.addPost( postObj );
                    }

                    monthObj.calculate();
                    monthLine.push( monthObj );

                }

            }

            idsPost = orderPost( idsPost );
            function orderPost( posts ){

                posts.sort(compareDate);
                function compareDate(a, b) {

                    if( a.dateCreate.year > b.dateCreate.year ) return 1;

                    if( a.dateCreate.year == b.dateCreate.year &&
                        a.dateCreate.month > b.dateCreate.month) {
                        return -1
                    }

                    if( a.dateCreate.year == b.dateCreate.year &&
                        a.dateCreate.month == b.dateCreate.month &&
                        a.dateCreate.day > b.dateCreate.day) {
                        return -1
                    }
                    if( a.dateCreate.year == b.dateCreate.year &&
                        a.dateCreate.month == b.dateCreate.month &&
                        a.dateCreate.day == b.dateCreate.day &&
                        a.dateCreate.hour > b.dateCreate.hour ) {
                        return -1
                    }

                    if( a.dateCreate.year == b.dateCreate.year &&
                        a.dateCreate.month == b.dateCreate.month &&
                        a.dateCreate.day == b.dateCreate.day &&
                        a.dateCreate.hour == b.dateCreate.hour &&
                        a.dateCreate.minute > b.dateCreate.minute) {
                        return -1
                    }

                    if( a.dateCreate.year == b.dateCreate.year &&
                        a.dateCreate.month == b.dateCreate.month &&
                        a.dateCreate.day == b.dateCreate.day &&
                        a.dateCreate.hour == b.dateCreate.hour &&
                        a.dateCreate.minute == b.dateCreate.minute &&
                        a.dateCreate.second > b.dateCreate.second ) {
                        return -1
                    }

                    return 1;
                }
                return posts;
            }

            console.log(idsPost);

            /*Ð½Ð°Ð·Ð½Ð°Ñ‡Ð°ÐµÐ¼ Ð¼ÐµÑÑÑ†Ð°Ð¼ Ð¿Ð¾Ð·Ð¸Ñ†Ð¸ÑŽ left*/
            var i,
                max = monthLine.length,
                left = 0;
            for( i = 0; i< max; i++ ){
                currentMonth = monthLine[i];
                currentMonth.setLeft( left );
                left += currentMonth.width;
            }

            /*Ð½Ð°Ð·Ð½Ð°Ñ‡Ð°ÐµÐ¼ ÑˆÐ¸Ñ€Ð¸Ð½Ñƒ Line*/
            self.width = left;

            /*Ð³ÐµÐ½ÐµÑ€Ð¸Ð¼ html Ð¾Ð±ÑŠÐµÐºÑ‚Ð° Line*/
            self.html = generateHtml();
            self.clip = self.html.find('.timeline-clip');
            self.buffer = self.html.find('.timeline-buffer');

            bind();
        }

        init();

    }
    function Month( year, month ){
        var self = this;
        var posts = [];
        var template = Handlebars.compile( jQuery(".timeLine_Line_Month").html() );
        /*
         * Ð¿Ð¾ÐºÐ°Ð·Ñ‹Ð²Ð°ÐµÑ‚ Ð²Ð¸Ð´ÐµÐ½ Ð»Ð¸ ÑÐµÐ¹Ñ‡Ð°Ñ Ð¼ÐµÑÑÑ† Ð½Ð° Ð»Ð¸Ð½Ð¸Ð¸
         * ÐµÑÐ»Ð¸ Ð²Ð¸Ð´ÐµÐ½ Ð²ÑÐµ Ð¿Ð¾ÑÑ‚Ñ‹ Ð¼ÐµÑÑÑ†Ð° Ð´Ð¾Ð¶Ð½Ñ‹ Ð·Ð°Ð¿Ñ€Ð¾ÑÐ¸Ñ‚ÑŒ title Ñ„Ð¾Ñ‚Ð¾Ð³Ñ€Ð°Ñ„Ð¸Ð¸ Ñ ÑÐµÑ€Ð²ÐµÑ€Ð°
         * */
        var visible = false;
        /*Ð¿Ð¾ÐºÐ°Ð·Ñ‹Ð²Ð°ÐµÑ‚ Ð·Ð°Ð¿Ñ€Ð°ÑˆÐ¸Ð²Ð°Ð»Ð¸ Ð»Ð¸ Ð¿Ð¾ÑÑ‚Ñ‹ ÑƒÐ¶Ðµ ÑÐ²Ð¾Ð¸ Ñ„Ð¾Ñ‚Ð¾Ð³Ñ€Ð°Ñ„Ð¸Ð¸ Ñ ÑÐµÑ€Ð²ÐµÑ€Ð°*/
        var postGetTitlePhoto = false;


        self.left = null;   //Ð²Ñ‹Ñ‡Ð¸ÑÐ»Ð¸Ñ‚ Ð¾Ð±Ñ‹ÑŠÐµÐºÑ‚ Line Ð´Ð»Ñ ÐºÐ°Ð¶Ð´Ð¾Ð³Ð¾ Ð¼ÐµÑÑÑ†Ð°
        self.width = null;
        self.html = null;
        self.year = year;
        self.month = month;


        this.setLeft = function( left ){
            self.left = left;
            self.right = left + self.width;
            self.html.css({
                left: left
            });
        }
        this.addPost = function( post ){
            posts.push(post);
            return false;
        }
        this.setVisible = function( newVisible ){
            visible = newVisible;
            if( visible && !postGetTitlePhoto ){
                postGetTitlePhoto = true;
                requestTitlePhoto();
            }
        }
        this.calculate = function(){
            /*Ð²Ñ‹Ñ‡Ð¸ÑÐ»Ð¸Ñ‚ÑŒ Ð¾Ð±Ñ‰ÑƒÑŽ ÑˆÐ¸Ñ€Ð¸Ð½Ñƒ Ð¼ÐµÑÑÑ†Ð° Ð¸ left Ð¿Ð¾Ð·Ð¸Ñ†Ð¸ÑŽ Ð¿Ð¾ÑÑ‚Ð¾Ð²*/
            setLeftPosToPostAndWidth();

            /*ÑÑ„Ð¾Ñ€Ð¼Ð¸Ñ€ÑƒÐµÐ¼ html*/
            self.html = generateHtml();

        }
        function requestTitlePhoto(){
            var i, max = posts.length;
            for( i = 0; i < max; i++ ){
                posts[i].getTitlePhoto();
            }
        }
        function setLeftPosToPostAndWidth(){
            var i,
                max = posts.length,
                currentPost,
                prevPost = null,
                leftPost = 0;


            /*Ð¿ÐµÑ€ÐµÐ±Ð¸Ñ€Ð°ÐµÐ¼ Ð²ÑÐµ Ð¿Ð¾ÑÑ‚Ñ‹*/
            for(i = 0; i < max; i++){
                currentPost = posts[i];

                /*Ð½Ð°Ð·Ð½Ð°Ñ‡Ð¸Ñ‚ÑŒ ÐºÐ°Ð¶Ð´Ð¾Ð¼Ñƒ Ð¿Ð¾ÑÑ‚Ñƒ ÑÐ²Ð¾ÑŽ Ð¿Ð¾Ð·Ð¸Ñ†Ð¸ÑŽ left*/
                if( currentPost.data.preset.id != 5 ){
                    /*ÐµÑÐ»Ð¸ Ñƒ Ð½Ð°Ñ Ð¿Ð¾ÑÑ‚ Ð´Ð¾Ð»Ð¶ÐµÐ½ Ð·Ð°Ð½Ð¸Ð¼Ð°Ñ‚ÑŒ Ñ‚Ð¾Ð»ÑŒÐºÐ¾ Ð¾Ð´Ð½Ð¾ Ð¼ÐµÑÑ‚Ð¾*/
                    currentPost.setLeft( leftPost );
                    currentPost.setTop( randomNumber(0, 30) );
                    leftPost += currentPost.data.width + 20;
                }else{
                    /*ÐµÑÐ»Ð¸ Ñƒ Ð½Ð°Ñ Ð¿Ð¾ÑÑ‚ Ð¼Ð¾Ð¶ÐµÑ‚ ÑÑ‚Ð¾ÑÑ‚ÑŒ Ð² Ð´Ð²Ð° Ñ€ÑÐ´Ð°*/
                    /*Ð¿Ñ€Ð¾Ð²ÐµÑ€ÑÐµÐ¼ ÐµÑÐ»Ð¸ Ð¿Ñ€Ð´Ñ‹Ð´ÑƒÑ‰Ð¸Ð¹ Ð¿Ð¾ÑÑ‚ Ð±Ñ‹Ð» Ð¼ÐµÐ»ÐµÐ½ÑŒÐºÐ¸Ð¹, Ñ‚ÐµÐºÑƒÑ‰Ð¸Ð¹ Ð¿Ð¾ÑÑ‚ Ð¾Ð¿ÑƒÑÐºÐ°ÐµÐ¼ Ð¿Ð¾Ð´ Ð½ÐµÐ³Ð¾*/
                    if( prevPost && prevPost.data.preset.id == 5 ){
                        currentPost.setLeft( leftPost - prevPost.data.width - 20 ); //Ð¼Ñ‹ Ð½Ðµ Ð¼ÐµÐ½ÑÐµÐ¼ ÑÐ°Ð¼Ð¾ Ð·Ð½Ð°Ñ‡ÐµÐ½Ð¸Ðµ left, Ð¼Ñ‹ Ð¿Ñ€Ð¾ÑÑ‚Ð¾ ÑÑ‚Ð°Ð²Ð¸Ð¼ Ñ‚ÐµÐºÑƒÑ‰Ð¸Ð¹ Ð¿Ð¾ÑÑ‚ Ð¿Ð¾Ð´ Ð¿Ñ€ÐµÐ´Ñ‹Ð´ÑƒÑ‰Ð¸Ð¹
                        currentPost.setTop( 205 );
                    }else{
                        /*Ð¿Ñ€Ð¾Ð²ÐµÑ€ÑÐµÐ¼ ÐµÑÐ»Ð¸ Ð¿Ñ€Ð´Ñ‹Ð´ÑƒÑ‰Ð¸Ð¹ Ð¿Ð¾ÑÑ‚ ÐÐ• Ð±Ñ‹Ð» Ð¼ÐµÐ»ÐµÐ½ÑŒÐºÐ¸Ð¹, Ñ‚ÐµÐºÑƒÑ‰Ð¸Ð¹ Ð¿Ð¾ÑÑ‚ ÑÑ‚Ð°Ð²Ð¸Ð¼ ÐºÐ°Ðº Ð¾Ð±Ñ‹Ñ‡Ð½Ð¾*/
                        currentPost.setLeft( leftPost );
                        currentPost.setTop( 0 );
                        leftPost += currentPost.data.width + 20;
                    }

                }

                prevPost = currentPost;

            }

            self.width = leftPost;
        }

        /*events*/
        mediator.subscribe('monthPrepareToShowPost', monthPrepareToShowPost);
        function monthPrepareToShowPost( data ){

            if( data.month_info.year === self.year &&
                data.month_info.month === self.month
                ){
                data.month_left = self.left;
                mediator.publish('LinePrepareToShowPost', data);
            }

        }

        function generateHtml(){
            var html = template({
                month: month,
                year: self.year,
                posts: posts
            });
            html = html.replace(/^[ \s]+/gm, '');
            html = $( html );
            html.css({
                position: 'absolute'
            });


            /*Ð²ÑÑ‚Ð°Ð²Ð»ÑÐµÐ¼ Ñ‚ÑƒÐ´Ð° Ð¿Ð¾ÑÑ‚Ñ‹*/
            var ulPosts = html.find('.posts');
            var i, max = posts.length;
            for( i = 0; i < max; i++ ){
                ulPosts.append(posts[i].htmlPreview);
            }
            ulPosts.width(self.width);

            return html;
        }

    }

    function Post( data ){

        var self = this;

        self.data = decodeData(data);
        self.htmlPreview = null;
        self.htmlMain = null;
        self.left = null;
        self.top = null;
        self.month_info = {};
        self.month_info.year = null;
        self.month_info.month = null;


        this.calculate = function (){
            self.data.width = calculateWidth();
            var previewView = new PostPreview( self.data );
            self.htmlPreview = previewView.getHtml();
            self.htmlPreview.on("click", self.show);
        }
        this.setLeft = function ( left ){
            self.left = left;
            self.htmlPreview.css({
                left: self.left
            });
        }
        this.setTop = function ( top ){
            self.top = top;
            self.htmlPreview.css({
                top: self.top
            });
        }

        /*Ð¼ÐµÑ‚Ð¾Ð´ Ð²Ñ‹Ð·Ñ‹Ð²Ð°ÐµÑ‚ÑÑ Ð¼ÐµÑÑÑ†Ð¾Ð¼ ÑÐ¾Ð´ÐµÑ€Ð¶Ð°Ñ‰Ð¸Ð¹ ÑÑ‚Ð¾Ñ‚ Ð¿Ð¾ÑÑ‚*/
        this.getTitlePhoto = function(){
            self.htmlPreview.find("img").attr('src', "/" + self.data.title_photo.pathFile );
        }
        this.show = function(){

            /*Ð»Ð¸Ð½Ð¸Ñ Ð´Ð¾Ð»Ð¶Ð½Ð° Ð¿ÐµÑ€ÐµÐµÑ…Ð°Ñ‚ÑŒ Ðº ÑÐ¾Ð¾Ñ‚Ð²ÐµÑ‚ÑÑ‚Ð²ÑƒÑŽÑ‰ÐµÐ¼Ñƒ Ð·Ð½Ð°Ñ‡ÐµÐ½Ð¸ÑŽ left*/
            /*ÑÑ‚Ð¾ ÑÐ¾Ð¾Ð±Ñ‰ÐµÐ½Ð¸Ðµ Ð»Ð¾Ð²Ð¸Ñ‚ Ð½ÐµÐ¾Ð±Ñ…Ð¾Ð´Ð¸Ð¼Ñ‹Ð¹ Ð¼ÐµÑÑÑ†, Ð´Ð¾Ð±Ð°Ð²Ð»ÑÐµÑ‚ Ðº Ð´Ð°Ð½Ð½Ñ‹Ð¼ ÑÐ²Ð¾ÑŽ Ð¿Ð¾Ð·Ð¸Ñ†Ð¸ÑŽ left Ð¸ Ð¿Ñ€Ð¾Ñ‚Ð°Ð»ÐºÐ¸Ð²Ð°ÐµÑ‚
             * ÑÐ¾Ð¾Ð±Ñ‰ÐµÐ½Ð¸Ðµ Ð½Ð°Ð²ÐµÑ€Ñ… Ð´Ð»Ñ Line, ÐºÐ¾Ñ‚Ð¾Ñ€Ñ‹Ð¹ Ð½ÐµÐ¿Ð¾ÑÑ€ÐµÐ´ÑÑ‚Ð²ÐµÐ½Ð½Ð¾ Ð¸ Ð¿ÐµÑ€ÐµÐ´Ð²Ð¸Ð³Ð°ÐµÑ‚ Ð¿Ð¾Ð·Ð¸Ñ†Ð¸ÑŽ left
             * */
            mediator.publish('monthPrepareToShowPost', {
                postId: self.data.id,
                post_width: self.data.width,
                post_left: self.left,
                post_top: self.top,
                month_info: self.month_info
            });

            /*Ð½ÐµÐ¼Ð½Ð¾Ð³Ð¾ Ð¿Ð¾Ð´Ð¾Ð¶Ð´Ð°Ñ‚ÑŒ Ð¸ */
            /*Ð¿Ð¾ÐºÐ°Ð·Ð°Ñ‚ÑŒ Ð½ÐµÐ¿Ð¾ÑÑ€ÐµÐ´ÑÑ‚Ð²ÐµÐ½Ð½Ð¾ Ñ‚ÐµÐ»Ð¾ Ð¿Ð¾ÑÑ‚Ð°*/
            setTimeout(showMainPost, 200);
        }
        function showMainPost(){

            var mainView = new PostMainView( self.data );
            self.htmlMain = mainView.getHtml();
            overlay.show();
            $('body').append(self.htmlMain);
            self.htmlMain.animate({opacity: 1}, 500);
            mainView.initMap();
        }
        function decodeData(data){
            data.text = data.text.replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, '\'').replace(/&lt;/g, '<');
            data.description = data.description.replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, '\'').replace(/&lt;/g, '<');
            data.title = data.title.replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, '\'').replace(/&lt;/g, '<');
            data.text = data.text.replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, '\'').replace(/&lt;/g, '<');
            data.video = data.video.replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, '\'').replace(/&lt;/g, '<');
            return data;
        }
        function calculateWidth(){
            var rate = 1;
            if( data.preset.position_img != "center" ){
                rate = 2;
            }

            return data.preset.img_width * rate;
        }

        mediator.subscribe('newHash', checkIdToShow);
        mediator.subscribe('showNextPost', checkIdToShow);
        function checkIdToShow(id){

            if( self.htmlMain ){
                self.htmlMain.remove();
                self.htmlMain = null;
            }

            if( id === self.data.id ){
                self.show();
            }
        }

    }
    function PostMainView( data ){

        var template = Handlebars.compile( jQuery(".timeLine_Line_Post_Main").html() );
        var html = render();

        function removeHtml(){
            html.animate({
                opacity: 0
            },{
                duration: 500,
                complete: function(){
                    html.remove();
                }
            });
        }
        function render(){
            html = template( data );
            html = html.replace(/^[ \s]+/gm, '');
            html = $( html );

            //append video
            if( data.video ){
                var video = new Video(data.video);
                if( video.object ){
                    html.find('.video').append( video.object );
                }
            }

            bind();

            return html;
        }
        function bind(){
            var nav = $('.nav', html);
            var nextBtn = $('.next', nav);
            var prevBtn = $('.prev', nav);


            nextBtn.on('click', function(){
                mediator.publish('postNavEvent', {
                    id: data.id,
                    type: "next"
                });
                hash.setHash( data.id );
            });
            prevBtn.on('click', function(){
                mediator.publish('postNavEvent', {
                    id: data.id,
                    type: "prev"
                });
                hash.setHash( data.id );
            });

        }

        mediator.subscribe("overlayHide", removeHtml);

        this.getHtml = function(){
            return html;
        }

        //append map
        this.initMap = function(){
            if( data.longitude ){
                var map = new Map();
                map.getMapByCoordinat( data.latitude, data.longitude, data.title );
            }
        }

    }
    function PostPreview( data ){

        var defaultSetting = {
            bg: ['white']
        }
        var template = Handlebars.compile( jQuery(".timeLine_Line_Post_Preview").html() );
        var html = render();

        function render(){
            html = template( data );
            html = html.replace(/^[ \s]+/gm, '');
            html = $( html );

            html.css({
                width: data.width,
                position: 'absolute'
            });

            html.addClass( defaultSetting.bg[randomNumber(0, defaultSetting.bg.length)]  );

            /*Ð´Ð¾Ð±Ð°Ð²Ð»ÐµÐ¼ ÑÐ¾Ð±Ñ‹Ñ‚Ð¸Ð¹*/
            html.on("click", function(){
                hash.setHash( data.id );
            });

            return html;
        }
        this.getHtml = function(){
            return html;
        }
    }

    function Overlay(){
        var template = Handlebars.compile( jQuery(".main_overlay").html() );
        var html = render();
        var self = this;

        this.hide = function(){
            html.hide();
        }
        this.show = function(){
            html.show();
        }

        function render(){
            html = template();
            html = html.replace(/^[ \s]+/gm, '');
            html = $( html );

            /*Ð´Ð¾Ð±Ð°Ð²Ð»ÐµÐ¼ ÑÐ¾Ð±Ñ‹Ñ‚Ð¸Ð¹*/
            html.on("click", function(){
                mediator.publish("overlayHide");
                self.hide();
            });

            return html;
        }
        function init(){
            $('body').append(html);
        };
        init()

    }
    function Video( path ){
        var self = this;
        this.object;

        function isYoutube (){
            if( path.search(/youtube/) != -1 ){
                return true;
            }else{
                return false;
            }
        }
        function findYoutubeCode( path ){
            var res = path.match(/=([\w\d]+)$/);
            if( res[1] ){
                return res[1];
            }else{
                return false;
            }
        }

        var youtubeTemplate = "<iframe  src='http://www.youtube.com/embed/==PATH==' frameborder='0' allowfullscreen></iframe>";

        function init(){
            if( isYoutube( path ) ){
                var code = findYoutubeCode( path );
                if( code ){
                    self.object = youtubeTemplate.replace(/==PATH==/, code);
                }
            }
            return false;
        }
        init();

    }
    function Map(){

        this.getMapByCoordinat = function( latitude, longitude, message ){
            var mapOptions = {
                center: new google.maps.LatLng( latitude, longitude ),
                zoom: 8,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            var point = new google.maps.LatLng( latitude, longitude );
            var marker = new google.maps.Marker({
                position: point,
                title: message
            });
            var map =  new google.maps.Map(document.getElementById("post_map"),
                mapOptions);
            marker.setMap(map);
            return false;
        }

    }
    function TimeLine_Audio(){
        var menu1 = "/public/files/audio/menu-rollover1.mp3";
        var menu2 = "/public/files/audio/menu-rollover2.mp3";
        var menu3 = "/public/files/audio/menu-rollover3.mp3";
        var menu4 = "/public/files/audio/menu-rollover4.mp3";
        var menu5 = "/public/files/audio/menu-rollover5.mp3";

        var item1 = "/public/files/audio/item-rollover1.mp3";
        var menu2 = "/public/files/audio/item-rollover2.mp3";
        var menu3 = "/public/files/audio/item-rollover3.mp3";

        var template = jQuery("<audio><source src='' type='audio/ogg'></audio>");


        var first = renderAudio(menu1);

        function renderAudio( src ){
            var audio = template.clone();
            audio.attr('src', src);
            //$('body').append(audio);
            return audio[0];
        }


        first.play();



    }
    function Hash(){

        var curerntHash = null;
        var self = this;


        this.parseHash = function(){

            var hash = window.location.hash;
            var result = hash.match(/#(\d+)?/);

            if( result && result[1] ){
                curerntHash = result[1];
                mediator.publish('newHash', curerntHash);
            }

            /*должны опубликовать что есть новый хеш*/
            /*post и line cлушают это сообщение*/
            /*line устанавливает новую позицию left*/
            /*post показывает background и показыает свое содержимое*/


        }

        this.getCurrentHash = function(){
            return hash;
        }
        this.setHash = function( hash ){
            var href = window.location.href;
            href = href.replace(/\/*#.*$/, "");
            window.history.pushState(null, null, "/#" + hash );
        }

        $(window).on('hashchange', self.parseHash);

    }
    function randomNumber( min, max ){
        return Math.round(min - 0.5 + Math.random()*(max-min+1))
    }

    function Year(){}
    //function Month(){}

    var hash = new Hash();
    var overlay = new Overlay();
    var timeLine_Audio = new TimeLine_Audio();
    var timeLineManager = new TimeLineManager();
    timeLineManager.init();

    b.constr.TimeLine = TimeLine;


})(b, b.modules.mediator);
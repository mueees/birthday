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

                /*создаем год, если такого еще нет*/
                if( !result.years[ dateCreate.year ] ){
                    result.years[ dateCreate.year ] = {
                        month: {}
                    };
                }

                /*создаем месяц, если такого еще нет*/
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

        /*подписываемся на события*/
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


            /*вставляем в буфер месяцы*/
            //todo заменить clip на buffer
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

        /*определяет перетаскивае мыши + инерцию*/
        function bindMouse(){

            var dragObj = null, // объект перетаскивания
                timeInter = 20, //кол-во последних миллисекунд которые берутся в расчет для расчета инерции
                mass = 5, // коэффициент служит для расчета инерции
                fading = 1.05, // коэффициент затухания инерции
                minImpuls = 0.1, // коэффициент при котором импульс прекращает действовать
                intervalImpuls, // переменная интервала инерциии
                impuls;     //значение самого импульса, который затухает с коэффициентом fading

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

                /*если драг дошел до левого конца, то движение должено прекратиться*/
                if( moveX > 0) return false;
                /*если драг дошел до правого конца, то движение должено прекратиться*/
                if( Math.abs( moveX ) + windowWidth > self.width ) return false;

                if( moveX > windowWidth + Math.abs(dragObj.moveX)) return false;
                dragObj.moveX = moveX;

                /*расчет для инерции*/
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

                /*подсчитываем инерцию*/
                if( dragObj != null ){
                    if( dragObj.inert.length > 0 ){
                        var curerntTime = new Date();
                        var lastPoint = dragObj.inert[ dragObj.inert.length - 1];

                        /*если мышка простояла более чем timeInter никуда не двигаюся то инерции не будет*/
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
            /*функция расчета смещения позиции left в результате работы импульса
             * ограничивает движение left если оно зашло слишком далеко
             * */
            function impulsStart(){

                var left = self.left - impuls;

                /*если импульс дошел до левого конца, то импульс должен прекратиться*/
                if( left > 0 ){
                    mediator.publish("timeline_left:change", {left: 0} );
                    clearInterval(intervalImpuls);
                    return false;
                }

                /*если импульс дошел до правого конца, то импульс должен прекратиться*/
                if( Math.abs( left - windowWidth ) > self.width ){
                    mediator.publish("timeline_left:change", {left: left} );
                    clearInterval(intervalImpuls);
                    return false;
                }

                /*если все нормально вещаем новую позицию left и уменьшаем импульс*/
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
        /*первое срабатывание функции происходит при загрузке страницы*/
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
                /*если импульс дошел до правого конца, то импульс должен прекратиться*/
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
            /*создает объекты постов и месяцев*/
            var years = postData['years'],
                year,
                month,
                post,
                currentYear,
                currentMonth,
                currentPost,

                monthObj,
                postObj;

            /*перебираем все года*/
            for( year in years ){
                currentYear = years[year];
                yearsLine.push(year);

                /*перебираем все месяца*/
                for( month in currentYear["month"] ){
                    currentMonth = currentYear["month"][month];
                    monthObj =  new Month( year, month );

                    /*перебираем все посты*/
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

            /*назначаем месяцам позицию left*/
            var i,
                max = monthLine.length,
                left = 0;
            for( i = 0; i< max; i++ ){
                currentMonth = monthLine[i];
                currentMonth.setLeft( left );
                left += currentMonth.width;
            }

            /*назначаем ширину Line*/
            self.width = left;

            /*генерим html объекта Line*/
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
         * показывает виден ли сейчас месяц на линии
         * если виден все посты месяца дожны запросить title фотографии с сервера
         * */
        var visible = false;
        /*показывает запрашивали ли посты уже свои фотографии с сервера*/
        var postGetTitlePhoto = false;


        self.left = null;   //вычислит обыъект Line для каждого месяца
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
            /*вычислить общую ширину месяца и left позицию постов*/
            setLeftPosToPostAndWidth();

            /*сформируем html*/
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


            /*перебираем все посты*/
            for(i = 0; i < max; i++){
                currentPost = posts[i];

                /*назначить каждому посту свою позицию left*/
                if( currentPost.data.preset.id != 5 ){
                    /*если у нас пост должен занимать только одно место*/
                    currentPost.setLeft( leftPost );
                    currentPost.setTop( randomNumber(0, 30) );
                    leftPost += currentPost.data.width + 20;
                }else{
                    /*если у нас пост может стоять в два ряда*/
                    /*проверяем если прдыдущий пост был меленький, текущий пост опускаем под него*/
                    if( prevPost && prevPost.data.preset.id == 5 ){
                        currentPost.setLeft( leftPost - prevPost.data.width - 20 ); //мы не меняем само значение left, мы просто ставим текущий пост под предыдущий
                        currentPost.setTop( 205 );
                    }else{
                        /*проверяем если прдыдущий пост НЕ был меленький, текущий пост ставим как обычно*/
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


            /*вставляем туда посты*/
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

        /*метод вызывается месяцом содержащий этот пост*/
        this.getTitlePhoto = function(){
            self.htmlPreview.find("img").attr('src', "/" + self.data.title_photo.pathFile );
        }
        this.show = function(){

            /*линия должна переехать к соответствующему значению left*/
            /*это сообщение ловит необходимый месяц, добавляет к данным свою позицию left и проталкивает
             * сообщение наверх для Line, который непосредственно и передвигает позицию left
             * */
            mediator.publish('monthPrepareToShowPost', {
                postId: self.data.id,
                post_width: self.data.width,
                post_left: self.left,
                post_top: self.top,
                month_info: self.month_info
            });

            /*немного подождать и */
            /*показать непосредственно тело поста*/
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

            /*добавлем событий*/
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

            /*добавлем событий*/
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


    /*DELETE*/

    /*    var o = {};
     o.INDEFICATOR = "MUE";
     _.extend(o, Backbone.Events);
     o.on('event1', function foo(text){alert(text)});
     o.on('event2', function boo(){alert("events")});

     setTimeout(function(){
     console.log(o);
     }, 1500);

     o.trigger('event1', "text");*/


})(b, b.modules.mediator);






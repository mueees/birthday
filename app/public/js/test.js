(function(b, mediator){

    var lang = GLOBAL_VAIRABLE.lang || "ru";


    function UploadFiles( idFolder ){

        var _idFolder = idFolder;
        var pathToServer = "/" + lang  + "/filemanager/uploadFiles";
        var tempRename = Handlebars.compile( jQuery(".filemanager_uploadTemplate").html());
        this.render = function(){
            var html = $($.parseHTML( tempRename() ) );

            var fileInput = jQuery('.fileInput', html),
                send = jQuery('.sendFiles', html),
                deleteFilesBtn = jQuery('.deleteFiles', html),
                wrapperFiles = jQuery('.files', html),
                cancel = jQuery('.cancel', html),
                filesToSend = {};

            fileInput.on('change', displayFiles);
            send.on('click', sendFile);
            deleteFilesBtn.on('click', deleteFiles);
            cancel.on("click", function(){
                html.trigger("close");
                html.remove();
            });

            function displayFiles(){
                var files = fileInput[0].files;
                jQuery.each( files, function(i, file){
                    if( !checkSize( file ) ){
                        showErrorInformation( file );
                    }else if(filesToSend[ file.name ] == undefined ){
                        filesToSend[ file.name ] = file;
                        showInformation( filesToSend[ file.name ] );
                    }else{
                        return false;
                    }
                } );

            }
            function showInformation( f ){
                var htmlFile = new ViewFile( f );
                wrapperFiles.append( htmlFile.render() );
            }
            function showErrorInformation( file ){
                var htmlFile = new ErrorFile( file );
                wrapperFiles.append( htmlFile.render() );
            }
            function checkFiles(){
                if( Object.keys(filesToSend).length == 0 ){
                    return false;
                }else{
                    return true;
                }
            }
            function checkSize( f ){
                if( f.size > 50000000 ){
                    return false;
                }else{
                    return true;
                }
            }
            function uploadOneFile( f ){

                if( filesToSend[f.name] == undefined ) return;

                var form = new FormData(),
                    request = new XMLHttpRequest();

                form.append('file[]', f );
                form.append('idFolder', _idFolder );

                request.open('POST', pathToServer );
                request.setRequestHeader("X-Requested-With", "XMLHttpRequest");

                request.upload.addEventListener(
                    'progress',
                    function( e ){
                        mediator.publish('progress', {
                            file: f,
                            e: e
                        });
                    }
                );
                request.upload.addEventListener(
                    'load',
                    function( e ){
                        mediator.publish('loadFile', f);
                    }
                );
                request.send( form );

                request.onreadystatechange = function(e)
                {
                    if (request.readyState==4){

                        if( request.status==200 ){
                            var path = e.currentTarget.response;
                            mediator.publish('showPathTofile', path, f);
                            removeFileFromData( f );
                        }else{
                            removeFileFromData( f );
                            mediator.publish('downloadError', f);
                        }

                    }
                }

                return false;

            }
            function sendFile(){

                if( !checkFiles() ) return false;

                var currentFile;

                for( var key in filesToSend ){
                    currentFile = filesToSend[ key ];
                    uploadOneFile( currentFile );
                }

                return false;
            }
            function removeFileFromData( f ){
                delete filesToSend[ f.name ];
                return false;
            }
            function deleteFiles(){
                if( !checkFiles() ) return false;

                var key, f;
                for( key in filesToSend ){
                    mediator.publish('deleteFromDom', filesToSend[ key ]);
                    delete filesToSend[ key ];
                }

                return false;
            }

            mediator.subscribe('uploadFile', uploadOneFile);
            mediator.subscribe('deleteFile', removeFileFromData);

            return html;

        }

    }

    function ViewFile( f ){

        var html,
            file = f;

        this.render = function() {
            return html;
        }

        function removeFile(){
            mediator.publish('deleteFile', f);
            removeFromDom();
            return false;
        }

        function uploadFile(){
            mediator.publish('uploadFile', f);
            return false;
        }

        function convertSizeToMb( size ){
            return (size/1000).toFixed(2);
        }

        function init(){
            html = template.clone();
            html.find('.fileName').append( f.name );
            html.find('.fileSize').append( convertSizeToMb( f.size ) + "Kb" );

            html.find('.delete').on('click', removeFile);
            html.find('.upload').on('click', uploadFile);
        }

        var template = jQuery('<li>' +
            '<div class="fileNameWrapper"><span class="fileName"></span></div>' +
            '<div class="fileSizeWrapper"><span class="fileSize"></span></div>' +
            '<div class="downloadInformation">' +
            '<div class="bar"><div class="progress"></div></div>' +
            '<span class="percent">0 %</span>' +
            '</div>' +
            '<div class="actionButton">' +
            '<a href="#" class="upload btn silver">upload</a>' +
            '<a href="#" class="delete btn silver">delete</a>' +
            '</div>' +
            '</li>');


        mediator.subscribe('showPathTofile', showPathTofile);
        mediator.subscribe('progress', progressFile);
        mediator.subscribe('deleteFromDom', removeFromDom);
        mediator.subscribe('loadFile', progressFile100);
        mediator.subscribe('downloadError', errorDownload);

        function progressFile100( loadFile ){

            if(f.name != loadFile['name'] ) return false;

            setProgressWidth( 100 );
            setProgressPercent( 100 );
        }
        function errorDownload( loadFile ){
            if(f.name != loadFile['name'] ) return false;
            html.find('.progress').addClass("error");
            html.find('.actionButton').remove();

        }
        function progressFile(data){
            var file = data['file'],
                e = data['e'],
                percent;

            if(f.name != file['name'] ) return false;

            percent = calculatePercent(e);
            setProgressWidth( percent );
            setProgressPercent( percent );

        }
        function removeFromDom(){
            html.remove();
            return false;
        }
        function showPathTofile(path, uploadFile){
            if(f.name != uploadFile.name ) return false;

            html.find('.actionButton').remove();
            return false;
        }

        function calculatePercent( data ){

            var totalSize = data.totalSize,
                position = data.position,
                percent;

            percent = (position*100)/totalSize;
            return Math.floor(percent);

        }
        function setProgressWidth( width ){
            if( setProgressWidth.progress == undefined ){
                setProgressWidth.progress = html.find('.progress');
            }

            setProgressWidth.progress.width( width + '%' );
        }
        function setProgressPercent( percent ){
            if( setProgressPercent.percent == undefined ){
                setProgressPercent.percent = html.find('.percent');
            }

            setProgressPercent.percent.html( percent + ' %' );
        }

        init();
    }
    function ErrorFile( f ){

        var html,
            template;

        function init(){
            html = template.clone();
            html.find('.fileName').append( f.name );
            html.find('.fileSize').append( convertSizeToMb( f.size ) + "Kb" );

            html.find('.delete').on('click', removeFile);
        }
        this.render = function() {
            return html;
        }
        function convertSizeToMb( size ){
            return (size/1000).toFixed(2);
        }

        template = jQuery('<li>' +
            '<div class="fileNameWrapper"><span class="fileName"></span></div>' +
            '<div class="fileSizeWrapper"><span class="fileSize"></span></div>' +
            '<div class="errorInformation">' +
            '<span>File size too big. Max upload size:  50 Mb.</span>' +
            '</div>' +
            '<div><a href="#" class="delete  btn silver">delete</a></div>' +
            '</li>');

        function removeFile(){
            removeFromDom();
            return false;
        }
        function removeFromDom(){
            html.remove();
            return false;
        }

        mediator.subscribe('deleteFromDom', removeFromDom);


        init();

    }

    b.constr.uploadFiles = UploadFiles;

})(b, b.modules.mediator);
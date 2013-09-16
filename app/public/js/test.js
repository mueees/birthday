(function(b, $, mediator, UploadFiles, Mediator){

    var lang = GLOBAL_VAIRABLE.lang || "ru";
    //локальный mediator

    function FileManager(){
        var selfFM = this;
        this._createFolderView = null
        this.template = Handlebars.compile( jQuery(".filemanager_generalTemplate").html() );


        /*большой объект Folder*/
        selfFM.Folder = function( data ){
            var self = this;
            var _data = data;

            var template = Handlebars.compile( jQuery(".filemanager_folderView").html()),
                templateBtn = Handlebars.compile( jQuery(".filemanager_folderButtons").html()),
                html = render(),

                idsFilesDeleteTemp = [],//

                name = html.find(".name"),
                edit = html.find(".edit"),
                children = html.find(".children"),
                point = html.find(".point"),
                hasChildren = false,
                isShowChildren = false,
                contextMenu = null,
                htmlContextMenu = null,
                fileStorage = {};  // хранятся объекты всех файлов

            //event

            //если создано еще какое то контестное меню, то всеостальные папки должны
            //удалить свои контекстные меню
            mediator.subscribe("fileManager:newContextCreate", deleteCurrentContext);
            function deleteCurrentContext(){

                if( contextMenu ){
                    contextMenu.removeAllView();
                    htmlContextMenu.remove();
                    contextMenu = null;
                }
            }

            //какая то папка была удалена, проверить не является ли она ребенком
            mediator.subscribe("fileManager:deleteFolder", HandlerDeleteChild);
            function HandlerDeleteChild( id ){

                if( !hasChildren ) return false;
                var index = hasChild(id);
                if( index !== false ){
                    removeChild( index );
                    setActualPoint();
                }
            }
            function hasChild( id ){
                for( var i = 0; i < _data.children.length; i++ ){
                    var child = _data.children[i];
                    if( child.id == id ) {
                        return i;
                        break;
                    }
                }
                return false;
            }
            function removeChild( index ){
                _data.children.splice( index, 1 );
                if( _data.children.length === 0 ) hasChildren = false;
            }

            point.on("click", pointHandler);
            function pointHandler(){
                if( !hasChildren ) return false;

                if( isShowChildren ){
                    hideChildren();
                }else{
                    showChildren();
                }
            }
            function hideChildren(){
                children.hide();
                point.removeClass('minus');
                point.addClass('plus');
                isShowChildren = false;
            }
            function showChildren(){
                children.show();
                point.removeClass('plus');
                point.addClass('minus');
                isShowChildren = true;
            }
            function setActualPoint(){

                if(hasChildren){
                    point.removeClass('noChildren');

                    if( isShowChildren ){
                        point.addClass('minus');
                        point.removeClass('plus');
                        children.show();
                    }else{
                        point.removeClass('minus');
                        point.addClass('plus');

                        children.hide();
                    }
                }else{
                    point.addClass('noChildren');
                }

            }

            name.on("click", getFileInfo);
            function getFileInfo(e){

                //чистим все что связано с файлами
                clearAllFiles();

                //запрашиваем файлы
                jQuery.ajax({
                    url: "/" + lang + "/filemanager/getfilesfromfolder",
                    type: "POST",
                    data:{
                        idFolder: _data.id
                    },
                    success: function(data){
                        successGetFiles(data);
                    },
                    error: function(data){
                        alert("Please try again");
                    }
                });

                return false;
            }
            function successGetFiles( data ){
                data = JSON.parse(data);
                if( !data.status ){
                    if( data.message ){
                        alert( data.message );
                    }else{
                        alert( "Error" );
                    }
                    return false;
                }

                var files = data.message;
                if( files.length == 0 ){
                    return false;
                }

                createFileObj(files);
            }
            function createFileObj(files){
                var i, file,
                    max = files.length,
                    fileData,
                    file;


                //сохраняем файлы в fileStorage
                for(i=0; i<max; i++){
                    fileData = files[i];

                    //создаем новый объект папка и сохраняем его
                    file = new File( fileData );
                    fileStorage[ fileData.id ] = file;
                }

                appendButton();
                renderFilesAndAppend();

            }
            function appendButton(){
                jQuery(".fileManager .files").append(getBtn());
            }
            function renderFilesAndAppend(){
                var file,
                    id,
                    renderFile,
                    ul = jQuery("<ul></ul>");

                //рендерим эти все файлы
                for( id in fileStorage ){
                    file = fileStorage[id];
                    renderFile = file.getRender();
                    ul.append( renderFile );
                }

                jQuery(".fileManager .files").append( ul );
            }

            function clearAllFiles(){
                clearFileStorage();
                clearFileArea();
            }
            function clearFileStorage(){
                fileStorage = {};
            }
            function clearFileArea(){
                jQuery(".fileManager .files").html("");
            }


            function getCheckedFilesData(){
                var files = getCheckedFiles(),
                    checkedData = [],
                    file,
                    id;

                //проходим циклом по файлам из этой папки, и собираем информацию с тех папок, которые выделенные
                for( id in files ){
                    file = files[id];
                    checkedData.push( file.getData() );
                }
                selfFM.publish("getSelectedFiles", checkedData);
            }
            function getCheckedFiles(){
                var id,
                    file,
                    checkedFiles = {};

                //проходим циклом по файлам из этой папки, и собираем информацию с тех папок, которые выделенные
                for( id in fileStorage ){
                    file = fileStorage[id];
                    if( file.isChecked() ){
                        checkedFiles[id] = file;
                    }
                }

                return checkedFiles;
            }


            function deleteFile(){
                var files = getCheckedFiles();
                idsFilesDeleteTemp = getId( files );

                jQuery.ajax({
                    url: "/" + lang + "/filemanager/removefiles",
                    type: "POST",
                    data:{
                        ids: JSON.stringify(idsFilesDeleteTemp)
                    },
                    success: function( data ){
                        successDeleteFiles( data );
                    },
                    error: function(data){
                        idsFilesDeleteTemp = [];//очистим список файлов, которые пользователь хотел удалить
                        alert("Please, try again");
                    }
                });

            }
            function successDeleteFiles( data ){

                data = JSON.parse(data);

                if( !data.status ){
                    if( data.message ){
                        alert( data.message );
                    }else{
                        alert( "Error" );
                    }
                    return false;
                }

                var i,
                    max = idsFilesDeleteTemp.length,
                    idFile;

                for(i = 0; i < max; i++){
                    idFile = idsFilesDeleteTemp[i];
                    delete fileStorage[idFile];

                    mediator.publish("fileManager:deleteFile", idFile);
                }

                idsFilesDeleteTemp = [];//очистим список файлов, которые пользователь хотел удалить

            }
            function getId( files ){
                var ids = [];
                for( var id in files ){
                    ids.push( id );
                }
                return ids;
            }


            edit.on("click", editHandler);
            function editHandler(){
                //эта папка хочет создать контекстное меню
                //все остальные папки должны удалить свои контекстные меню

                //мы можем создать новое контекстное меню,
                //только если его еще нет

                if( contextMenu ) {
                    deleteCurrentContext();
                    return;
                }

                mediator.publish("fileManager:newContextCreate");
                contextMenu = new ContextMenuFolder( _data );
                htmlContextMenu = contextMenu.render();


                //подписываемся на события от контекстного меню
                htmlContextMenu.on("close", deleteCurrentContext);
                htmlContextMenu.on("rename", renameFolder);
                htmlContextMenu.on("create", createFolder);
                htmlContextMenu.on("delete", deleteFolder);

                html.append( htmlContextMenu );

                return false;
            }

            function createFolder(eventData){

                jQuery.ajax({
                    url: "/" + lang +  "/filemanager/createfolder",
                    type: "POST",
                    data:{
                        parentId: _data.id,
                        name: eventData.name
                    },
                    success: function(data){
                        successCreate(data);
                    },
                    error: function(data){
                        alert("Please, try again");
                    }
                });
            }
            function successCreate( data ){
                data = JSON.parse(data);
                if( !data.status ){
                    if( data.message ){
                        alert( data.message );
                    }else{
                        alert( "Error" );
                    }
                    return false;
                }

                var _data = data.message;

                var f = new selfFM.Folder( _data );

                //todo при создании папки в папке, новую папку мы не копируем в главное приложение    rootFolders: [], listFolders: [],
                if( !hasChildren ) hasChildren = true;
                isShowChildren = true;
                setActualPoint();

                var fView = f.getRender();
                children.append( fView );

            }
            function renameFolder( eventData ){

                jQuery.ajax({
                    url: "/" + lang +  "/filemanager/renamefolder",
                    type: "POST",
                    data:{
                        idFolder: _data.id,
                        newName: eventData.name
                    },
                    success: function(data){
                        successRename( data, eventData.name );
                    },
                    error: function(){
                        alert("Please, try again");
                    }
                });

            }
            function successRename(data, newName){
                data = JSON.parse(data);
                if( !data.status ){
                    if( data.message ){
                        alert( data.message );
                    }else{
                        alert( "Error" );
                    }
                    return false;
                }

                mediator.publish("fileManager:renameFolder", newName);
                clearAllFiles();

                _data.name = newName;
                name.html(newName);
            }
            function deleteFolder(){

                jQuery.ajax({
                    url: "/" + lang +  "/filemanager/removefolder",
                    type: "POST",
                    data:{
                        idFolder: _data.id
                    },
                    success: function(data){
                        successDelete(data);
                    },
                    error: function(data){
                        console.log(data);
                    }
                });

            }
            function successDelete(data){

                data = JSON.parse(data);
                if( !data.status ){
                    if( data.message ){
                        alert( data.message );
                    }else{
                        alert( "Error" );
                    }
                    return false;
                }

                mediator.publish("fileManager:deleteFolder", _data.id);
                html.remove();
                jQuery('.fileManager .files').remove();
            }

            //отдает свой html + проверяет есть ли дети, и если есть, отдает и ихний html
            this.getRender = function(){
                if( self.children && self.children.length > 0 ){
                    hasChildren = true;

                    var i, max = self.children.length;

                    for( i = 0; i < max; i++ ){
                        var child = self.children[i];
                        children.append( child.getRender() );
                    }

                }
                return html;
            }
            function render(){
                return  $(  jQuery.parseHTML(template( data ))[1]  );
            }
            function getBtn(){
                var htmlBtn = renderHtmlBtn(),
                    getFilesBtn = htmlBtn.find(".getFiles"),
                    deleteFilesBtn = htmlBtn.find(".deleteFiles");
                getFilesBtn.on("click", getCheckedFilesData);
                deleteFilesBtn.on("click", deleteFile);

                return htmlBtn;
            }
            function renderHtmlBtn(){
                return  $(  jQuery.parseHTML(templateBtn())[1]  );
            }

        }
        expandByCopy( self.prototype, Mediator );

    }
    expandByCopy( FileManager.prototype, Mediator.prototype );
    expandByCopy( FileManager.prototype, {
        rootFolders: [],
        listFolders: [],
        getFolder: function(){

            var self = this;
            $.ajax({
                url: "/" + lang + "/filemanager/getfolders",
                type: "POST",
                success: jQuery.proxy( self.parseFolders, self ),
                error: self.errorGetFolder
            });
        },
        errorGetFolder: function(){
            alert("Something wrong, please try again");
        },
        parseFolders: function( data ){

            var self = this;
            data = JSON.parse(data);
            if( !data.status ){
                if( data.message ){
                    alert( data.message );
                }else{
                    alert( "Error" );
                }
                return false;
            }

            var dataFolders = data.message;
            this.rootFolders = [];
            this.listFolders = [];

            /*если есть какие-то папки, ты вставим их в основной шаблон*/
            if( dataFolders || dataFolders.length > 0 ){
                var i, max = dataFolders.length;

                for( i = 0; i < max; i++){
                    var dataFolder = dataFolders[i];
                    this.rootFolders.push( this.recursiveCreateFolder( dataFolder ) );
                }

                var folderTree = this.renderFoldersTree();
                this.html.find(".folder").append( folderTree );
            }

            jQuery("body").append( self.html );
        },
        recursiveCreateFolder: function( dataFolder ){
            var f = new this.Folder( dataFolder );

            if( dataFolder.children.length > 0 ){
                f.children = [];
                for( var j = 0; j < dataFolder.children.length; j++ ){
                    f.children.push( this.recursiveCreateFolder( dataFolder.children[j] ) );
                }
            }
            this.listFolders.push(f);

            return f;
        },
        renderFoldersTree: function(){
            var rootTree = jQuery("<ul class='rootTree'></ul>");
            var i, max = this.rootFolders.length;

            for( i = 0; i < max; i++ ){
                var currentRootFolder = this.rootFolders[i];
                rootTree.append( currentRootFolder.getRender() );
            }

            return rootTree;

        },
        render: function(){
            var self = this;
            return $(  jQuery.parseHTML(self.template())[1]  );
        },
        getCreateFolderView: function(){
            var createFolderTemp = new CreateFolderView();
            return createFolderTemp.render();
        },
        bindEvent: function(){
            var self = this;

            /*создание рутовой папки*/
            var createBtn = this.html.find(".createFolder");
            createBtn.click(function(){
                if( self._createFolderView ) return false;

                self._createFolderView = self.getCreateFolderView();
                jQuery("body").append(self._createFolderView);

                self._createFolderView.on("create", function(eventData){
                    self.createRootFolder(eventData);
                    self._createFolderView = null;
                });
                self._createFolderView.on("close", function(eventData){
                    self._createFolderView = null;
                });

            });

            var closeManager = this.html.find(".closeManager");
            closeManager.on("click", jQuery.proxy( self.closeManager, self));


        },
        closeManager: function(){
            this.clearAllStorage();
            this.clearHtml();
            this.publish("closeManager");
            FileManager.prototype.topics = {};
        },
        clearAllStorage: function(){
            this.rootFolders = [];
            this.listFolders = [];
        },
        clearHtml: function(){
            this.html.remove();
        },

        getSelectedFiles: function( files ){
            this.publish("getSelectedFiles", files);
        },

        createRootFolder: function(eventData){
            var self = this;
            jQuery.ajax({
                url: "/" + lang + "/filemanager/createfolder",
                type: "POST",
                data:{
                    parentId: 0,
                    name: eventData.name
                },
                success: jQuery.proxy( self.successCreateFolder, self),
                error: function(data){
                    alert("Please, try again");
                }
            });
        },
        successCreateFolder: function( data ){
            data = JSON.parse(data);

            if( !data.status ){
                if( data.message ){
                    alert( data.message );
                }else{
                    alert( "Error" );
                }
                return false;
            }

            var folderData = data.message;
            var self = this;

            var f = new this.Folder( folderData );
            self.listFolders.push(f);

            var fView = f.getRender();
            self.html.find(".rootTree").append( fView );

        },

        init: function( passportId ){
            var self = this;
            self.passportId = passportId;
            this.html = this.render();
            this.bindEvent();
            this.getFolder();
        }
    } );
    function File( data ){
        var _data = data;
        var tempRename = Handlebars.compile( jQuery(".filemanager_standartFileView").html());
        var html = $($.parseHTML( tempRename({
            name: _data.name,
            path: _data.path
        })));
        var checked = false;

        html.on("click", chooseHandler );
        function chooseHandler(){
            if( checked ){
                checked = false;
                html.removeClass("checked");
                mediator.publish("fileManager:fileUnchecked", _data);
            }else{
                html.addClass("checked");
                checked = true;
                mediator.publish("fileManager:fileChecked", _data);
            }
        }

        mediator.subscribe("fileManager:deleteFile", deleteHtml);
        function deleteHtml( id ){
            if( _data.id !== id ) return false;
            html.remove();
        }

        this.getRender = function(){
            return html;
        }
        this.getData = function(){
            return _data;
        }
        this.isChecked = function(){
            return checked;
        }


    }

    function RenameView( name ){
        var tempRename = Handlebars.compile( jQuery(".filemanager_renameWindow").html());
        this.render = function(){
            var self = this;
            var html = $($.parseHTML( tempRename() ) );

            html.find('.currentName').html(name);

            var ok = html.find(".ok");
            var cancel = html.find(".cancel");
            var input = html.find("input");

            ok.click(function(){
                var newName = input.val();
                html.trigger({
                    type: "rename",
                    name: newName
                });
                html.remove();
            });
            cancel.click(function(){
                html.trigger("close");
                html.remove();
            });

            return html;

        }
    }
    function CreateFolderView(){
        var temp = Handlebars.compile( jQuery(".filemanager_createFolderView").html());
        this.render = function(){
            var self = this;
            var html = $($.parseHTML( temp() ) );

            var ok = html.find(".ok");
            var cancel = html.find(".cancel");
            var input = html.find("input");

            cancel.click(function(){
                html.trigger("close");
                html.remove();
            })

            ok.click(function(){
                var nameFolder = input.val();
                html.trigger({
                    type: "create",
                    name: nameFolder
                });
                html.remove();
            })

            return html;

        }
    }
    function DeleteFolderView( name ){
        var temp = Handlebars.compile( jQuery(".filemanager_deleteFolderView").html());
        this.render = function(){
            var self = this;
            var html = $($.parseHTML( temp() ) );

            html.find('.nameFolder').html(name);

            var ok = html.find(".ok");
            var cancel = html.find(".cancel");

            cancel.click(function(){
                html.trigger("close");
                html.remove();
            })

            ok.click(function(){
                html.trigger("delete");
                html.remove();
            })

            return html;

        }
    }

    function ContextMenu_Base(){

        this.renameView = null;
        this.getRenameView = function( name ){
            var renameObj = new RenameView( name );
            return renameObj.render();
        }

    }

    function expandByCopy(C, P){
        for( var key in P ){
            C[key] = P[key];
        }
    }
    function inheritAll(C, P){
        var F = function(){};
        F.prototype = P.prototype;
        C.prototype = new P();
    }

    inheritAll(ContextMenuFolder, ContextMenu_Base);


    function ContextMenuFolder( dataFolder ){
        var self= this;
        var templateFolder = Handlebars.compile( jQuery(".filemanager_contextFolderMenu").html());
        var htmlFolder =  $( jQuery.parseHTML(templateFolder()) );

        var createFolder = htmlFolder.find(".createConMenu");
        var uploadFiles = htmlFolder.find(".uploadConMenu");
        var renameFolder = htmlFolder.find(".renameConMenu");
        var deleteFolder = htmlFolder.find(".deleteConMenu");
        var close = htmlFolder.find(".closeConMenu");

        var isVisible = true;
        function hideContextMenu(){
            isVisible = true;
            htmlFolder.hide();
        }

        //subView
        var createFolderVeiw = null;
        var getCreateFolderView = function(){
            var view = new CreateFolderView();
            return view.render();
        };

        var deleteFolderView = null;
        var getDeleteFolderView = function(){
            var view = new DeleteFolderView(dataFolder.name);
            return view.render();
        };

        var uploadFileView = null;
        var getUploadFileView = function(){
            var view = new UploadFiles( dataFolder.id );
            return view.render();
        };

        //events
        createFolder.on("click", function(){

            self.removeAllView();

            hideContextMenu();

            createFolderVeiw = getCreateFolderView();

            createFolderVeiw.on("close", function(){
                self.removeAllView();
            });

            createFolderVeiw.on("create", function( data ){

                htmlFolder.trigger({
                    type: "create",
                    name: data.name
                });
                self.removeAllView();
                self.removeContextMenu();
            })

            jQuery("body").append(createFolderVeiw);

        })
        uploadFiles.on("click", function(){
            self.removeAllView();

            hideContextMenu();

            uploadFileView = getUploadFileView();

            uploadFileView.on("close", function(){
                htmlFolder.trigger("close");
                self.removeAllView();
                self.removeContextMenu();
            });

            jQuery("body").append(uploadFileView);

        });
        renameFolder.on( "click", function(){

            self.removeAllView();

            hideContextMenu();

            self.renameView = self.getRenameView(dataFolder.name);

            self.renameView.on("close", function(){
                self.removeAllView();
                self.removeContextMenu();
            });
            self.renameView.on("rename", function( data ){
                htmlFolder.trigger({
                    type: "rename",
                    name: data.name
                });
                self.removeAllView();
                self.removeContextMenu();
            })

            jQuery("body").append(self.renameView);
        })
        deleteFolder.on("click", function(){

            self.removeAllView();

            hideContextMenu();

            deleteFolderView = getDeleteFolderView();

            deleteFolderView.on("close", function(){
                self.removeAllView();
                self.removeContextMenu();
            });

            deleteFolderView.on("delete", function( data ){
                htmlFolder.trigger("delete");
                self.removeAllView();
                self.removeContextMenu();
            })

            jQuery("body").append(deleteFolderView);
        })
        close.on("click", function(){
            self.removeContextMenu();
        })

        this.render = function(){
            return htmlFolder;
        }
        this.removeAllView = function(){
            if( self.renameView ) self.renameView.remove();
            if( createFolderVeiw ) createFolderVeiw.remove();
            if( deleteFolderView ) deleteFolderView.remove();
            if( uploadFileView ) uploadFileView.remove();
            self.renameView = null
            createFolderVeiw = null;
            deleteFolderView = null;
            uploadFileView = null;
        }
        this.removeContextMenu = function(){
            htmlFolder.trigger("close");
            htmlFolder.remove();
        }
    }


    b.constr.FileManager = FileManager;

})(b, jQuery, b.modules.mediator, b.constr.uploadFiles, b.constr.Mediator);
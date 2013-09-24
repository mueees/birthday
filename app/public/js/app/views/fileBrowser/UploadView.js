define([
    'marionette',
    'text!app/templates/fileBrowser/UploadView.html'
], function(Marionette, template){

    var config = {
        maxFileSize: 50000000
    }

    return Marionette.ItemView.extend({
        template: _.template(template),

        events: {
            "change form": "formChange",
            "submit form": "submit"
        },

        ui: {
            "uploadFile": ".uploadFile"
        },

        initialize: function(data){
            this.path = data.path;
            this.channel = data.channel;

            this.listenTo(this.channel, "setNewPath", this.setNewPath);
        },

        formChange: function(){

            var files = this.ui.uploadFile[0].files;
            var _this = this;
/*
            jQuery.each( files, function(i, file){
                if( !_this.checkSize( file ) ){
                    showErrorInformation( file );
                }else if(filesToSend[ file.name ] == undefined ){
                    filesToSend[ file.name ] = file;
                    showInformation( filesToSend[ file.name ] );
                }else{
                    return false;
                }
            });*/
        },

        displayFiles: function(){

        },

        checkSize: function(f){
            if( f.size > config.maxFileSize ){
                return false;
            }else{
                return true;
            }
        },

        setNewPath: function(data){
            this.path = data.path;
        },

        submit: function(e){
            e.preventDefault();

            var form = new FormData(),
            files = this.ui.uploadFile[0].files,
                _this = this;

            if(!files.length) return false;

            _.each(files, function(file){
                form.append("uploadFile[]", file);
            })

            form.append("path", this.path);

            $.ajax({
                url: "/upload",
                type: "POST",
                data: form,
                processData: false,  // tell jQuery not to process the data
                contentType: false,   // tell jQuery not to set contentType,
                success: function(){
                    _this.channel.trigger('goToPath', {path: _this.path});
                    _this.channel.trigger('showMessage', {text: "File uploaded."});
                },
                error: function(){
                    _this.channel.trigger('showMessage', {text: "Cannot upload files."});
                }
            });


        }
    })

});
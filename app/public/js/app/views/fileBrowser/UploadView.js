define([
    'marionette',
    'text!app/templates/fileBrowser/UploadView.html'
], function(Marionette, template){

    return Marionette.ItemView.extend({
        template: _.template(template),

        events: {
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
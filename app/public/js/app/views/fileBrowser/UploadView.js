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

        initialize: function(){

        },

        submit: function(e){
            e.preventDefault();

            var form = new FormData(),
            files = this.ui.uploadFile[0].files;

            _.each(files, function(file){
                form.append("uploadFile[]", file);
            })


            /*var oReq = new XMLHttpRequest();
            oReq.open("POST", "/upload");
            oReq.send(form);*/

            $.ajax({
                url: "/upload",
                type: "POST",
                data: form,
                processData: false,  // tell jQuery not to process the data
                contentType: false   // tell jQuery not to set contentType
            });
        }
    })

})
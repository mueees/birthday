define([
    'marionette',
    'text!app/templates/fileBrowser/ExplorerView.html',

    /*views*/
    'app/views/fileBrowser/FolderView',
    'app/views/fileBrowser/FileView'

], function(Marionette, template, FolderView, FileView){

    return Marionette.ItemView.extend({
        template: _.template(template),

        events: {

        },

        ui: {

        },

        initialize: function(data){
            this.collection = data.collection;
            this.channel = data.channel;


        },

        onRender: function(){

        }
    })

})
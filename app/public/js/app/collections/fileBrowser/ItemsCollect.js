define([
    'app/app',
    'backbone',
    'marionette',
    'app/models/fileBrowser/file',
    'app/collections/_base/collection'
],function(App, Backbone, Marionette, FileModel, BaseColletion){

    return BaseColletion.extend({
        model: FileModel

        /*parse: function(response){
            for( var i = 0; i < response.length; i++ ){
                var post = response[i];

                post.date = new Date(post.date);
                this.push(post);
            }

            return this.models;
        }*/
    })

})
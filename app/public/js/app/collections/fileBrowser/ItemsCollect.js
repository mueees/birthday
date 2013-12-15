define([
    'app/app',
    'backbone',
    'marionette',
    'app/models/fileBrowser/file',
    'app/collections/_base/collection'
],function(App, Backbone, Marionette, FileModel, BaseColletion){

    return BaseColletion.extend({
        model: FileModel,

        comparator: function(a, b){
            a = a.get("isDirectory");
            b = b.get("isDirectory");
            return a > b ?  -1
                : a < b ? 1
                : 0;
        },

        getActiveItem: function(){
            var result = [];
            this.each(function(model, i){
                if( model.get("isActive") ){
                    result.push(model);
                }
            })
            return result;
        }

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
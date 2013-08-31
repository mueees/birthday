define([
    'app/app',
    'marionette',

    'app/views/blog/addPost/addPostView'
], function(App, Marionette, AddPostView){


    App.module("Blog.AddPost", {

        startWithParent: true,

        define: function(AddPost, App, Backbone, Marionette, $, _){

            var Controller = {
                addPost: function(){
                    var addPostView = this.getAddPostView();

                    var addPostOnServer = _.bind(this.addPostOnServer, this);
                    addPostView.on('addPostOnServer', addPostOnServer);
                    App.main.show(addPostView);
                },

                addPostOnServer: function(){

                },

                getAddPostView: function(){
                    return new AddPostView();
                }
            }

            var API = {
                addPost: function(){
                    Controller.addPost();
                }
            }

            AddPost.API = API;

        }
    })

})
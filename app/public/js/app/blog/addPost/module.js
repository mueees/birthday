define([
    'app/app',
    'marionette'
], function(App, Marionette, AddEventView){


    App.module("Blog.AddPost", {

        startWithParent: true,

        define: function(AddPost, App, Backbone, Marionette, $, _){

            var Controller = {
                addPost: function(){}
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
define([
    'jquery',
    'backbone',
    'marionette',
    'app/app',

    /*modules*/
    'app/blog/addPost/module'
], function(jQuery, Backbone, Marionette, App){

    App.module("Blog", {
        startWithParent: false,

        define: function( Blog, App, Backbone, Marionette, $, _ ){

            var Router = Marionette.AppRouter.extend({

                before: function(){
                    App.startSubApp( "Blog", {} );
                },

                appRoutes: {
                    "blog/add" : "addPost",
                    "blog/change/:id" : "changePost",
                    "blog/post/:id" : "showPost",
                    "blog/posts" : "showPosts",
                    "blog/tag/:tag" : "showPostByTag"
                }

            })

            var Controller = {

            }

            var API = {
                addPost: function(){
                    Blog.AddPost.API.addPost();
                },

                changePost: function( id ){
                    Blog.ChangePost.API.changeUser( id );
                },

                showPost: function(id){
                    Blog.Showpost.API.showPost(id);
                },

                showPosts: function(){
                    Blog.Showpost.API.showPosts();
                },

                showPostByTag: function(tab){
                    Blog.Showpost.API.showPostByTag(tab);
                }
            }




            App.addInitializer(function(){
                new Router({
                    controller: API
                })
            })


        }
    })


})
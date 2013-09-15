define([
    'jquery',
    'backbone',
    'marionette',
    'app/app',

    /*layout*/
    'app/layouts/blog/layout',

    /*modules*/
    'app/blog/menu/module',
    'app/blog/addPost/module',
    'app/blog/listPost/module',
    'app/blog/changePost/module'
], function(jQuery, Backbone, Marionette, App, LayoutBlogAdminPanel){

    App.module("Blog", {
        startWithParent: false,

        define: function( Blog, App, Backbone, Marionette, $, _ ){

            var Router = Marionette.AppRouter.extend({

                before: function(){
                    App.startSubApp( "Blog", {} );
                },

                appRoutes: {
                    'blog': "blog",
                    "blog/add" : "addPost",
                    "blog/change/:id" : "changePost",
                    "blog/post/:id" : "showPost",
                    "blog/posts" : "showPosts",
                    "blog/tag/:tag" : "showPostByTag"
                }

            })

            var Controller = {
                showBlog: function(){

                    var _this = this;

                    var layoutBlogAdminPanel = new LayoutBlogAdminPanel();
                    layoutBlogAdminPanel.render();
                    App.main.show( layoutBlogAdminPanel );

                    Blog.Menu.API.showMenu( layoutBlogAdminPanel.menuContainer );
                    Blog.AddPost.API.setRegion(layoutBlogAdminPanel.contentContainer);
                    Blog.ListPost.API.setRegion(layoutBlogAdminPanel.contentContainer);

                    /*events*/
                    App.channels.blog.on("edit", function(data){
                        _this.showChangeView(data, layoutBlogAdminPanel)
                    });

                },

                showChangeView: function(data, layoutBlogAdminPanel){

                    $.when(Blog.ChangePost.API.getChangePostViewByModel({model: data})).done(function(changeView){
                        layoutBlogAdminPanel.extendContainer.show(changeView);
                    }).fail(function(){console.log("WTF!")});

                }
            }

            var API = {
                blog: function(){
                    Controller.showBlog();
                },

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

            //Blog.Channel = _.extend({}, Backbone.Events);


        }
    })


})
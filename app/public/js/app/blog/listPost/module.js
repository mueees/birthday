define([
    'app/app',
    'marionette',

    /*views*/
    'app/views/blog/listPost/FilterView',
    'app/layouts/blog/listPost/layout',
    'app/views/blog/listPost/ListPostsView',

    /*modules*/
    'app/modules/notify/module'

], function(App, Marionette, FilterView, ListPostLayout, ListPostsView){


    App.module("Blog.ListPost", {

        startWithParent: true,

        define: function(ListPost, App, Backbone, Marionette, $, _){

            var currentRegion;

            /*modules*/
            var Notify = App.module("Notify");

            var Controller = {
                showListPost: function(data){

                    var layout = this.getListPostLayout();
                    currentRegion.show(layout);

                    //show filter
                    var filterView = this.getFilterView();
                    layout.filterContainer.show(filterView);


                    var done = _.bind(Controller.getPostsSuccess, this);
                    var fail = _.bind(Controller.getPostsError, this);
                    //get all posts
                    $.when( App.request('blog:getPosts')).fail(fail).done(function(data){
                        done(data, layout);
                    });


                    //append all posts

                },

                getPostsSuccess: function( data, layout ){
                    var postCollection = data.postCollection;

                    if( postCollection.length == 0 ){
                        alert("Sorry, we don't have posts");
                        return false;
                    }

                    var listPostsView = new ListPostsView({
                        postCollection: data.postCollection
                    });

                    layout.postsContainer.show(listPostsView);
                },

                getPostsError: function(){
                    console.log("WTF!");
                },

                getFilterView: function(){
                    return new FilterView();
                },

                getListPostLayout: function(){
                    return new ListPostLayout();
                }
            }

            var API = {
                setRegion: function( region ){
                    currentRegion = region;
                }
            }

            ListPost.API = API;
            ListPost.listenTo( App.channels.blog, "changeMenu:listPost", function(data){Controller.showListPost(data)});

        }
    })

})
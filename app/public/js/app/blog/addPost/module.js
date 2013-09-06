define([
    'app/app',
    'marionette',

    'app/views/blog/addPost/addPostView'
], function(App, Marionette, AddPostView){


    App.module("Blog.AddPost", {

        startWithParent: true,

        define: function(AddPost, App, Backbone, Marionette, $, _){

            var currentRegion;

            var Controller = {
                addPost: function( data ){

                    var _this = this;
                    var addPostView = this.getAddPostView();
                    if( data.region ){
                        data.region.show(addPostView);
                    }else{
                        currentRegion.show(addPostView);
                    }

                    var addPostOnServer = _.bind(this.addPostOnServer, this);
                    addPostView.on('addNewPost', addPostOnServer);

                },

                addPostOnServer: function(data){
                    var success = _.bind(this.addPostSuccess, this);
                    var error = _.bind(this.addPostError, this);

                    $.when( App.request('blog:saveNewPost', data)).fail( error ).done( success );
                },

                addPostSuccess: function(){

                },

                addPostError: function(){
                    alert("error saving");
                },

                getAddPostView: function(){
                    return new AddPostView();
                }
            }

            var API = {
                addPost: function(){
                    Controller.addPost();
                },
                setRegion: function( region ){
                    currentRegion = region;
                }
            }

            AddPost.API = API;
            AddPost.listenTo( App.channels.blog, "changeMenu:addPost", function(data){Controller.addPost(data)} );

        }
    })

})
define([
    'jquery',
    'backbone',
    'marionette',
    'app/app',

    /*views*/
    'app/views/timeline/TimeLineView'

], function(jQuery, Backbone, Marionette, App, TimeLineView){

    App.module("Timeline", {
        startWithParent: false,

        define: function( Event, App, Backbone, Marionette, $, _ ){


            var Router = Marionette.AppRouter.extend({

                before: function(){
                    App.startSubApp( "Event", {} );
                },

                appRoutes: {
                    "public/timeline": "timelineShow"
                }

            })

            var Controller = {
                timelineShow: function(){

                    var done = _.bind(Controller.getPostsSuccess, this);
                    var error = _.bind(Controller.getPostsError, this);

                    //$.when(  App.request('blog:getPosts')).fail( error ).done(done);

                    this.getPostsSuccess([{
                        _id: "234234t65g",
                        title: "Some title",
                        preset: {
                            classes: "bla test",
                            width: 530,
                            name: "test"
                        },
                        previewTitle: "This is preview title",
                        previewImg: "/img/pla.jpg",
                        date: new Date()
                    }]);

                },

                getPostsSuccess: function(posts){

                    if( posts.length == 0 ){
                        alert("Sorry, we don't have posts");
                        return false;
                    }

                    var posts = this.parsePost(posts);
                    var timeLineView = new TimeLineView({posts:posts});

                },

                parsePost: function(posts){
                    var result = {
                            years: {}
                        },
                        i,
                        max = posts.length,
                        post,
                        date;

                    for( i = 0; i < max; i++ ){
                        post = posts[i];
                        date = post['date'];

                        /*создаем год, если такого еще нет*/
                        if( !result.years[ date.getFullYear() ] ){
                            result.years[ date.getFullYear() ] = {
                                month: {}
                            };
                        }

                        /*создаем месяц, если такого еще нет*/
                        if( !result.years[ date.getFullYear() ].month[ date.getMonth() ] ){
                            result.years[ date.getFullYear() ].month[date.getMonth()] = {
                                postData: {}
                            }
                        }
                        result.years[ date.getFullYear() ].month[date.getMonth()].postData[ post["_id"] ] = post;
                    }

                    return result;
                },

                getPostsError: function(){
                    console.log("WTF!");
                }
            }

            var API  = {
                timelineShow: function(){
                    Controller.timelineShow();
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
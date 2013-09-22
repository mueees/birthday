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

        define: function( Timeline, App, Backbone, Marionette, $, _ ){


            var Router = Marionette.AppRouter.extend({

                before: function(){
                    App.startSubApp( "Timeline", {} );
                },

                appRoutes: {
                    "public/timeline": "timelineShow"
                }

            })

            var Controller = {

                timelineShow: function(){

                    var done = _.bind(Controller.getPostsSuccess, this);
                    var error = _.bind(Controller.getPostsError, this);

                    $.when(  App.request('blog:getPosts')).fail( error ).done(done);

                },

                getPostsSuccess: function(data){

                    var postCollection = data.postCollection;

                    if( postCollection.length == 0 ){
                        alert("Sorry, we don't have posts");
                        return false;
                    }

                    var posts = this.parsePost(postCollection);
                    var timeLineView = new TimeLineView({
                        rowPostData:posts,
                        channel: Timeline.Channel
                    });

                    App.main.show(timeLineView);


                },

                parsePost: function(postCollection){
                    var result = {
                            years: {}
                        },
                        i,
                        max = postCollection.length,
                        post,
                        posts = postCollection.toJSON(),
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
                    Timeline.Channel.off();
                    Controller.timelineShow();
                }
            }

            Timeline.API = API;
            Timeline.Channel = _.extend({}, Backbone.Events);

            App.addInitializer(function(){
                new Router({
                    controller: API
                })
            })


        }
    })


})
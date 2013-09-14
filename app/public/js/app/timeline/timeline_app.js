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

                    /*this.getPostsSuccess([{
                        _id: "2342340t65g",
                        title: "Some title",
                        preset: {
                            classes: "bla test",
                            width: 130,
                            name: "test"
                        },
                        previewTitle: "This is preview title1",
                        previewImg: "/img/pla.jpg",
                        date: new Date(2015, 06, 13)
                    },
                        {
                            _id: "2342394t654g",
                            title: "Some title1",
                            preset: {
                                classes: "bla test",
                                width: 230,
                                name: "test"
                            },
                            previewTitle: "This is preview title2",
                            previewImg: "/img/pla.jpg",
                            date: new Date(2014, 08, 13)
                        },
                        {
                            _id: "2342834t654g",
                            title: "Some title1",
                            preset: {
                                classes: "bla test",
                                width: 230,
                                name: "test"
                            },
                            previewTitle: "This is preview title2",
                            previewImg: "/img/pla.jpg",
                            date: new Date(2014, 08, 13)
                        },
                        {
                            _id: "234234t654g",
                            title: "Some title1",
                            preset: {
                                classes: "bla test",
                                width: 230,
                                name: "test"
                            },
                            previewTitle: "This is preview title2",
                            previewImg: "/img/pla.jpg",
                            date: new Date(2014, 08, 13)
                        },
                        {
                            _id: "2342374t654g",
                            title: "Some title1",
                            preset: {
                                classes: "bla test",
                                width: 230,
                                name: "test"
                            },
                            previewTitle: "This is preview title2",
                            previewImg: "/img/pla.jpg",
                            date: new Date(2014, 08, 13)
                        },
                        {
                            _id: "2342346t654g",
                            title: "Some title1",
                            preset: {
                                classes: "bla test",
                                width: 230,
                                name: "test"
                            },
                            previewTitle: "This is preview title2",
                            previewImg: "/img/pla.jpg",
                            date: new Date(2014, 08, 13)
                        },
                        {
                            _id: "234234t654g",
                            title: "Some title1",
                            preset: {
                                classes: "bla test",
                                width: 230,
                                name: "test"
                            },
                            previewTitle: "This is preview title2",
                            previewImg: "/img/pla.jpg",
                            date: new Date(2014, 08, 13)
                        },
                        {
                            _id: "234234t654g",
                            title: "Some title1",
                            preset: {
                                classes: "bla test",
                                width: 230,
                                name: "test"
                            },
                            previewTitle: "This is preview title2",
                            previewImg: "/img/pla.jpg",
                            date: new Date(2014, 08, 13)
                        },
                        {
                            _id: "2345234t654g",
                            title: "Some title1",
                            preset: {
                                classes: "bla test",
                                width: 230,
                                name: "test"
                            },
                            previewTitle: "This is preview title2",
                            previewImg: "/img/pla.jpg",
                            date: new Date(2014, 08, 13)
                        },
                        {
                            _id: "234234t654g",
                            title: "Some title1",
                            preset: {
                                classes: "bla test",
                                width: 230,
                                name: "test"
                            },
                            previewTitle: "This is preview title2",
                            previewImg: "/img/pla.jpg",
                            date: new Date(2014, 08, 13)
                        },
                        {
                            _id: "2342434t654g",
                            title: "Some title1",
                            preset: {
                                classes: "bla test",
                                width: 230,
                                name: "test"
                            },
                            previewTitle: "This is preview title2",
                            previewImg: "/img/pla.jpg",
                            date: new Date(2014, 08, 13)
                        },
                        {
                            _id: "234234t654g",
                            title: "Some title1",
                            preset: {
                                classes: "bla test",
                                width: 230,
                                name: "test"
                            },
                            previewTitle: "This is preview title2",
                            previewImg: "/img/pla.jpg",
                            date: new Date(2014, 08, 13)
                        },
                        {
                            _id: "234234t654g",
                            title: "Some title1",
                            preset: {
                                classes: "bla test",
                                width: 230,
                                name: "test"
                            },
                            previewTitle: "This is preview title2",
                            previewImg: "/img/pla.jpg",
                            date: new Date(2014, 08, 13)
                        },
                        {
                            _id: "2342334t654g",
                            title: "Some title1",
                            preset: {
                                classes: "bla test",
                                width: 230,
                                name: "test"
                            },
                            previewTitle: "This is preview title2",
                            previewImg: "/img/pla.jpg",
                            date: new Date(2014, 08, 13)
                        },
                        {
                            _id: "234234t65g4",
                            title: "Some title2",
                            preset: {
                                classes: "bla test",
                                width: 230,
                                name: "test"
                            },
                            previewTitle: "This is preview title3",
                            previewImg: "/img/pla.jpg",
                            date: new Date()
                        }
                    ]);*/

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
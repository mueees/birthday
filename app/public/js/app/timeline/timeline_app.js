define([
    'jquery',
    'backbone',
    'marionette',
    'app/app'
], function(jQuery, Backbone, Marionette, App){

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

                    $.when(  App.request('blog:getPosts')).fail( error ).done(done);

                },

                getPostsSuccess: function(data){
                    debugger
                },

                getPostsError: function(){

                }
            }

            var API  = {
                timelineShow: Controller.timelineShow
            }




            App.addInitializer(function(){
                new Router({
                    controller: API
                })
            })


        }
    })


})
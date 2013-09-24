define([
    'jquery',
    'backbone',
    'marionette',
    'app/app',

    /*extend*/
    'extend/router',

    /*sub app*/
    './addEvent/module',
    './showEvent/module'


], function(jQuery, Backbone, Marionette, App, RouterExtend){

    App.module("Event", {
        startWithParent: false,

        define: function( Event, App, Backbone, Marionette, $, _ ){


            var Router = Marionette.AppRouter.extend({

                before: function(){
                    if(!Controller.determineAccess()){
                        return false;
                    }
                    App.startSubApp( "Event", {} );
                },

                appRoutes: {
                    "event/add": "addEvent",
                    "events(/:tab)": "showEvents"
                }

            })

            var Controller = {

                determineAccess: function(){
                    var state = App.request('user:islogin');
                    if(!state){
                        Backbone.history.navigate("/");
                        App.channels.main.trigger("accessDenied");
                        return false;
                    }else{
                        return true;
                    }
                },

                addEvent: function(){
                    Event.AddEvent.API.addEvent();
                },
                showEvents: function( tab ){
                    Event.ShowEvent.API.showEvents( tab )
                }
            }

            var API  = {
                addEvent: Controller.addEvent,
                showEvents: Controller.showEvents
            }

            App.addInitializer(function(){
                new Router({
                    controller: API
                })
            })


        }
    })


})
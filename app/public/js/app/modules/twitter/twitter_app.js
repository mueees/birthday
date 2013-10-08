define([
    'jquery',
    'backbone',
    'marionette',
    'app/app',

    /*models*/
    './models/stream',

    /*views*/
    "./modules/addStream/views/AddStreamView",
    "./modules/changeStream/views/ChangeStreamView",

    /*layout*/
    './layout/layout',

    /*modules*/
    "./modules/menu/module",
    './modules/showTweets/module',
    'app/modules/notify/module',
    "app/modules/websocket/websocket_app"
], function(jQuery, Backbone, Marionette, App, StreamModel, AddStreamView, ChangeStreamView, Layout){

    App.module("Twitter", {
        startWithParent: false,

        define: function( Twitter, App, Backbone, Marionette, $, _ ){


            /*modules*/
            var Notify = App.module("Notify");
            var ShowTweets = App.module("Twitter.ShowTweets");

            var layout;

            var Router = Marionette.AppRouter.extend({

                before: function(){
                    App.startSubApp( "Twitter", {} );
                },

                appRoutes: {
                    "twitter": "init"
                }

            })

            var Controller = {
                init: function(){

                    //создать layout
                    layout = new Layout();
                    layout.render();
                    App.main.show( layout );

                    var menu = Twitter.Menu.API.showMenu({
                        region: layout.menuContainer
                    });


                    //получить данные по group меню
                    //отрисовать и вставить меню

                },

                showAddStreamForm: function(){
                    var addStreamView = new AddStreamView({
                        channel: App.channels.twitter
                    });
                    layout.extendContainer.show(addStreamView);
                },

                saveNewStream: function(data){
                    var success = _.bind(this.saveNewStreamSuccess, this);
                    var error = _.bind(this.saveNewStreamError, this);

                    var stream = new StreamModel(data);
                    stream.save(null,{
                        success: success,
                        error: error
                    })
                },

                saveNewStreamSuccess: function(model){

                    Notify.API.showNotify({text: "Stream created"});
                    App.channels.twitter.trigger("streamSaved", model);
                },

                saveNewStreamError: function(){
                    Notify.API.showNotify({text: "Cannot create created"});
                },

                start: function(){
                    //подписаться на tweet
                    this.subscribeNewTweet();
                },

                subscribeNewTweet: function(){

                    var done = _.bind(this.subscribeNewTweetSuccess, this);
                    var fail = _.bind(this.subscribeNewTweetError, this);

                    var request = {
                        method: App.config.api.twitter.subscribe,
                        params: {}
                    }

                    $.when( App.request('websocket:send', request)).fail(fail).done(done);
                },

                subscribeNewTweetSuccess: function(){
                    Notify.API.showNotify({text: "Waiting for new tweet..."});
                    
                    //create view for rendering tweets
                    ShowTweets.API.showStreamTweet({region: layout.listContainer});

                },

                subscribeNewTweetError: function(error){
                    Notify.API.showNotify({text: error.message});
                },

                stop: function(){
                    //отписаться от tweet
                    this.unsubscribeNewTweet();
                },

                unsubscribeNewTweet: function(){
                    var done = _.bind(this.unsubscribeNewTweetSuccess, this);
                    var fail = _.bind(this.unsubscribeNewTweetError, this);

                    var request = {
                        method: App.config.api.twitter.unsubscribe,
                        params: {}
                    }

                    $.when( App.request('websocket:send', request)).fail(fail).done(done);
                },

                unsubscribeNewTweetSuccess: function(){
                    Notify.API.showNotify({text: "Unsubscribe success"});
                },

                unsubscribeNewTweetError: function(error){
                    Notify.API.showNotify({text: error.message});
                },

                changeStreamParams: function(data){
                    var changeStreamView = new ChangeStreamView({
                        model: data.model,
                        channel: App.channels.twitter
                    })
                    layout.extendContainer.show(changeStreamView);
                },

                showMessage: function(text){
                    Notify.API.showNotify({text: text});
                }

            }

            var API  = {
                init: Controller.init
            }

            App.addInitializer(function(){
                new Router({
                    controller: API
                })
            })

            Twitter.on("start", function(){
                Controller.start();
            });

            Twitter.on("stop", function(){
                Controller.stop();
            });



            /*Events*/
            App.channels.twitter.on("showMessage", Controller.showMessage);
            App.channels.twitter.on("showAddStreamForm", Controller.showAddStreamForm);
            App.channels.twitter.on("changeStreamParams", Controller.changeStreamParams);
            App.channels.twitter.on("saveNewStream", function(data){Controller.saveNewStream(data)});
            

        }
    })


})
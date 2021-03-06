define([
    'app/app',
    'marionette',

    /*layout*/
    './layout/layout',

    /*views*/
    './views/StreamView',

    /*modules*/
    'app/modules/notify/module'


], function(App, Marionette, Layout,  StreamView){


    App.module("Twitter.Menu", {

        startWithParent: true,

        define: function(Menu, App, Backbone, Marionette, $, _){

            /*modules*/
            var Notify = App.module("Notify");

            var Controller = {
                getMenu: function(){

                    var layout = new Layout();
                    layout.render();

                    var streamView = new StreamView({
                        channel: App.channels.twitter
                    });

                    layout.on("show", function(){
                        layout.streamContainer.show(streamView);
                    });

                    return layout;
                },

                showMenu: function(data){
                    var layout = new Layout();
                    layout.render();
                    data.region.show(layout);

                    var done = _.bind(this.getStreamsSuccess, this);
                    var error = _.bind(this.getStreamsError, this);

                    $.when( App.request('twitter:getStreams', data)).fail( error ).done(
                        function(data){done(data, layout)}
                    );
                },

                getStreamsSuccess: function(data, layout){
                    var _this = this;
                    var streamView = new StreamView({
                        streamCollection: data.streamCollection,
                        channel: App.channels.twitter
                    });

                    streamView.on("changeStream", function(data){
                        _this.changeStream(data)
                    });

                    layout.streamContainer.show(streamView);

                },

                getStreamsError: function(data){
                    Notify.API.showNotify({
                        text: data.message || "Cannot get stream"
                    });
                },

                changeStream: function(data){

                    var request = {
                        params: data,
                        method: App.config.api.twitter.changeChannel
                    }

                    var done = _.bind(this.changeStreamSuccess, this);
                    var error = _.bind(this.changeStreamError, this);

                    $.when( App.request('websocket:send', request)).fail( error ).done( done );

                },

                changeStreamSuccess: function(){
                    Notify.API.showNotify({
                        text: "Channel was changed"
                    });
                },

                changeStreamError: function(){
                    Notify.API.showNotify({
                        text: "Cannot change channel"
                    });
                }

            }

            var API = {
                getMenu: function(){
                    return Controller.getMenu();
                },

                showMenu: function(data){
                    Controller.showMenu(data);
                }
            }

            Menu.API = API;

            /*Event*/


        }
    })

});
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

                    streamView.on("deleteStream", function(data){
                        _this.deleteStream(data);
                    });

                    layout.streamContainer.show(streamView);

                },

                getStreamsError: function(){
                    debugger
                },

                deleteStream: function(data){
                    var id = data.id;

                    var deleteStreamRequest = {
                        method: 'twitter/stream/delete',
                        params: {
                            id: id
                        }
                    }

                    var done = _.bind(this.deleteStreamRequestSuccess, this);
                    var fail = _.bind(this.deleteStreamRequestError, this);

                    $.when( App.request('websocket:send', deleteStreamRequest)).fail(fail).done(done);
                },

                deleteStreamRequestSuccess: function(){
                    Notify.API.showNotify({text: "Stream deleted"});
                    //удалить view
                    

                },

                deleteStreamRequestError: function(){
                    Notify.API.showNotify({text: "Cannot delete stream"});
                },

                changeStream: function(data){

                    var request = {
                        params: data,
                        method: App.config.api.twitter.changeChannel
                    }

                    var done = _.bind(this.changeStreamSuccess, this);
                    var error = _.bind(this.changeStreamError, this);

                    //$.when( App.request('websocket:send', request)).fail( error ).done( done );

                    var addListenerRequest = {
                        method: App.config.api.twitter.addListener, params: {}
                    }

                    $.when( App.request('websocket:send', addListenerRequest)).fail(
                        function(){debugger}
                    ).done(
                        function(){debugger}
                    );

                },

                changeStreamSuccess: function(){
                    debugger
                },

                changeStreamError: function(){
                    debugger
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
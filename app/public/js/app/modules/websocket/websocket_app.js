define([
    'jquery',
    'backbone',
    'marionette',
    'app/app'
], function(jQuery, Backbone, Marionette, App){

    App.module("Websocket", {
        startWithParent: false,

        define: function( Websocket, App, Backbone, Marionette, $, _ ){

            var requests = {}
            var sock;
            var id = 0;
            var intervalReconnect;
            var socketState = false;
            var opts = {
                reconnect: true,
                timeIntervalReconnect: 1000
            }

            var Controller = {
                init: function(){
                    //todo: нужна обертка над SockJS, для автоматического stringify, возможно валидации
                    sock = new SockJS('http://localhost:56898/socket');
                    sock.onmessage = this.onMessage;
                    socketState = true;
                    if(intervalReconnect){
                        clearInterval(intervalReconnect);
                    }
                },

                onOpen: function(){

                },

                onMessage: function(e){
                    var data = JSON.parse(e.data);
                    console.log(data);
                },

                onClose: function(){
                    socketState = false;
                    if( !opts.reconnect ) return false;
                    intervalReconnect  = setInterval(Controller.init, opts.timeIntervalReconnect);
                },

                publish: function(message){
                    if( !socketState ) return false;
                    sock.send( JSON.stringify(message) );
                },

                response: function(message, deferred){
                    //todo: need implementation
                },

                request: function(message, deferred){
                    id++;
                    //todo: добавить валидацию на отправляемые сообщения

                    message.id = id;
                    sock.send( JSON.stringify(message) );
                    requests[id] = deferred;
                }

            }

            var API  = {
                publish: function(message){
                    Controller.publish(message);
                },

                response: function(message){

                },

                request: function(message, deferred){
                    Controller.request(message, deferred);
                }
            }

            Websocket.API = API;

            App.addInitializer(function(){
                Controller.init();
            })

        }
    })


})
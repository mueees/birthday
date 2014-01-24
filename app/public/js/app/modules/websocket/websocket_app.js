define([
    'app/app',
    'jquery',
    'backbone',
    'marionette'
], function(App, jQuery, Backbone, Marionette){

    App.module("Websocket", {
        startWithParent: false,

        define: function( Websocket, App, Backbone, Marionette, $, _ ){

            //list of sending request
            var requests = {};

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
                    var _this = this;

                    //todo: нужна обертка над SockJS, для автоматического stringify, возможно валидации

                    sock = new SockJS(App.config.websocket.url);
                    sock.onmessage = function(e){_this.onMessage(e)};
                    sock.onclose = function() {
                        _this.onClose();
                    };
                    socketState = true;
                    if(intervalReconnect){
                        clearInterval(intervalReconnect);
                    }
                },

                onOpen: function(){

                },

                onMessage: function(e){
                    var data = JSON.parse(e.data);

                    //determine what is it
                    if( data.id ){
                        if( data.method ){

                        }else{
                            //this is response
                            this.onMessageResponse(data);
                        }
                    }else if (data.channel){
                        //this is publish message
                        this.onMessagePublish(data);
                    }
                },

                onMessagePublish: function(data){
                    App.channels.websocket.trigger(data.channel, data.params);
                },

                onMessageResponse: function(data){

                    //todo: можно логировать такие ответы, на которые нет deferred объекта
                    if(!requests[data.id]) return false;

                    if( !data.errors ){
                        //this is success answer
                        requests[data.id].resolve(data.result);
                    }else{
                        //this is error answer
                        requests[data.id].reject(data.errors);
                    }

                    delete requests[data.id];
                },

                onClose: function(){
                    socketState = false;
                    if( !opts.reconnect ) return false;
                    intervalReconnect  = setInterval(function(){ Controller.init() }, opts.timeIntervalReconnect);
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
                    message = JSON.stringify(message);
                    sock.send( message );
                    
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
            Controller.init();

        }
    })


})
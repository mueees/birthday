define([
    'jquery',
    'backbone',
    'marionette',
    'app/app',
    '../websocket_app'

], function(jQuery, Backbone, Marionette, App){


    var websocket = App.module('Websocket');

    var id = 0;

    function newId(){
        id++;
    }

    var API = {
        send: function(message){
            if( message.method ){
                //this is request

                var deferred = $.Deferred();
                websocket.API.request(message, deferred);

                return deferred.promise();
            }else if( message.channel ){
                //this is publish
                websocket.API.publish(data);

            }else if( message.error || message.result ){
                //this is response
                websocket.API.response(message);

            }else{
                return false;
            }

        }
    }

    App.reqres.setHandler('websocket:send', function(data){
        return API.send(data);
    })

})

//при выполнении одной комманды
/*
 принимает промис, params, method,
 генерит id
 связывает промис с id
 отсылает запрос на сервер
 определяет таймаут
 когда пришел ответ или вышел таймаут делает resolve или reject промису
 */


/*
 имеет канал в который паблишит сообщение пришедние с сервера
 сообщения с сервера должны иметь определенный формат
 модули подписываются и отписываются от этих сообщений в канале
 */

/*
 на базе этого можно отсылать координаты мыши, и потом строить тепловую карту
 определять ширину и высоту окна, и для каждой ширины и высоты отрисовывать тепловую карта
 */

/*
 на базе этого можно мониторить состояние сервера, в частности использование памяти
 */

/*
 обрабатывает запросы с сервера
 по сути одно и тоже что на клиенте  что на сервере
 */
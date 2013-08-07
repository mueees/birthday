/*
 Простой кеш для запросов API.
 Преобразовывает запрос в ХЕШ и хранит для этого запроса ответ.

 будет передаваться ajax объект для запроса
 Пример:
 {
 url: '/api/user/get'
 type: 'GET',
 data: {
 id: 1258
 }
 }

 Конвертируется в
 */

define([
    'backbone',
    'marionette',
    'app/app'
], function(Backbone, Marionette, App){

    App.module('Cache', {
        startWithParent: true,

        define: function( Cache, App, Backbone, Marionette, $, _ ){

            /*
             Store all result
             */
            var cache = {};

            function set(key, value){
                cache[key] = value;
            }

            function get(key){
                try{
                    return cache[key];
                }catch(e){
                    return null;
                }
            }

            function clear(){
                cache = {};
            }

            _.extend(Cache, {
                get: get,
                set: set,
                clear: clear
            })

        }
    })

})
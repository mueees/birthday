define([
    'app/app',
    'marionette'
], function(App, Marionette, TabView){


    App.module("EventsViewManage", {

        startWithParent: true,

        define: function(EventsViewManage, App, Backbone, Marionette, $, _){

            var currentRegion = null;

            var Controller = {

                calendarChanged: function(data){
                    // data.dt_range - диапазон необходимых дат
                    // data.type - определяет с помощью какой view надо выводить события
                   if( !Controller.validate(data) || !currentRegion ) return false;

                    // запросить события с этого диапазона дат
                    // создать view отображающую данный диапазон
                    // вставить view в DOM

                    $.when( App.request('event:getEventsToShow', {dt_range: data.dt_range} ) );

                },

                setRegion: function( region ){
                    currentRegion = region;
                },

                validate: function(data){
                    return ( !data || !data.type || !data.dt_range ) ? false : true;
                }

            }

            var API = {
                calendarChanged: function(data){
                    return Controller.calendarChanged(data);
                },

                setRegion: function( region ){
                    Controller.setRegion( region );
                }
            }

            EventsViewManage.API = API;


            /*Events*/
            App.channels.main.on( App.config.eventName.main.calendarChanged, API.calendarChanged);

        }
    })

})
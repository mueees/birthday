define([
    'app/app',
    'marionette',

    /*view*/
    'app/views/modules/eventsViewManage/agenda'
], function(App, Marionette, AgendaView){


    App.module("EventsViewManage", {

        startWithParent: false,

        define: function(EventsViewManage, App, Backbone, Marionette, $, _){

            var currentRegion = null;
            var currentData = null;

            var Controller = {

                calendarChanged: function(data){
                    // data.dt_range - диапазон необходимых дат
                    // data.type - определяет с помощью какой view надо выводить события
                    if( !Controller.validate(data) || !currentRegion ) return false;

                    // запросить события с этого диапазона дат
                    // создать view отображающую данный диапазон
                    // вставить view в DOM

                    currentData = data;
                    if( data.type == 'agenda' ){
                        var done = _.bind(this.renderAgenda, this)
                        var error = _.bind(this.errorRequestEvent, this)
                    }
                    var _this = this;

                    $.when( App.request('event:getEventsToShow', {dt_range: data.dt_range} )).done(
                        function(dataRequest){
                            done( data.dt_range, dataRequest.eventToShowCollection )
                        }
                    );

                },

                renderAgenda: function( dt_range, eventToShowCollection ){

                    var dataTorender = this.prepareToRenderAgenda( dt_range, eventToShowCollection );
                    var agendaView = new AgendaView({dataTorender: dataTorender});
                    currentRegion.show( agendaView );


                },

                prepareToRenderAgenda: function(dt_range, eventToShowCollection){

                    var result = [];

                    var start = new Date( dt_range.start.startObj );
                    var end = new Date( dt_range.end.endObj );
                    var currentDate;
                    var d = new Date(start);

                    for( d; d <= end; d.setDate( d.getDate() + 1 ) ){
                        currentDate = new Date(d);
                        result.push({
                            date: currentDate,
                            events: eventToShowCollection.getEventsByDate(currentDate)
                        })
                    }

                    return result;

                },

                errorRequestEvent: function(){
                    console.log('WTF!');
                },

                setRegion: function( region ){
                    currentRegion = region;
                },

                validate: function(data){
                    return ( !data || !data.type || !data.dt_range ) ? false : true;
                },

                updateCurrentTab: function(options){

                    if( currentData.type == 'agenda' ){
                        var done = _.bind(this.renderAgenda, this)
                        var error = _.bind(this.errorRequestEvent, this)
                    }

                    $.when( App.request('event:getEventsToShow', {dt_range: currentData.dt_range} )).done(
                        function(dataRequest){
                            done( currentData.dt_range, dataRequest.eventToShowCollection )
                        }
                    );

                }

            }

            var API = {
                calendarChanged: function(data){
                    return Controller.calendarChanged(data);
                },

                updateCurrentTab: function(options){
                    Controller.updateCurrentTab(options);
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
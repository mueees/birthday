define([
    'app/app',
    'marionette',

    /*layouts*/
    'app/layouts/event/showEvent/layout',

    /*components*/
    'app/components/views/calendar/calendar',

    /*modules*/
    'app/modules/tab_event_range/module',
    'app/modules/eventsViewManage/module'

], function(App, Marionette, ShowLayout, CalendarView){


    App.module("Event.ShowEvent", {

        startWithParent: true,

        define: function(ShowEvent, App, Backbone, Marionette, $, _){


            var defaults = {
                defaultTab: "Agenda",
                tabs: ['agenda']
            }

            var TabEvents =  App.module('TabEvents');
            var EventsViewManage =  App.module('EventsViewManage');
            var currentLayout = null;


            var Controller = {
                showEvents: function( tab ){

                    //получить Layout
                    currentLayout = new ShowLayout();

                    //получить TabEvents View
                    var tabsView = TabEvents.API.getTabView();

                    //получить Calendar View
                    var calendar = new CalendarView();

                    //определить название tab для запроса
                    tab = Controller.determineTab(tab);

                    currentLayout.render();
                    App.main.show( currentLayout );
                    EventsViewManage.API.setRegion( currentLayout.content );

                    App.channels.main.on(App.config.eventName.main.changeEvent, Controller.showEditView);

                    currentLayout.sidebarLeft.show(calendar);
                    currentLayout.header.show(tabsView);

                    tabsView.setTab( tab );

                },

                offAllListeners: function(){
                    App.channels.main.off(App.config.eventName.main.changeEvent, Controller.showEditView);
                    currentLayout = null;
                },

                showEditView: function( data ){

                },

                determineTab: function(tab){
                    if( tab ){

                        tab = tab.toLowerCase();

                        if( $.inArray(tab, defaults.tabs) == -1){
                            return defaults.defaultTab;
                        }else{
                            return tab;
                        }

                    }else{
                        return defaults.defaultTab;
                    }

                }
            }


            ShowEvent.on("stop", Controller.offAllListeners);

            var API = {

                beforeStart: function(){
                    ShowEvent.stop();
                    ShowEvent.start();
                },
                showEvents: function(){
                    API.beforeStart();
                    Controller.showEvents()
                }
            }

            ShowEvent.API = API;


        }
    })

})
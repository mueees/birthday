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


            var Controller = {
                showEvents: function( tab ){

                    //получить Layout
                    var layout = new ShowLayout();

                    //получить TabEvents View
                    var tabsView = TabEvents.API.getTabView();

                    //получить Calendar View
                    var calendar = new CalendarView();

                    //определить название tab для запроса
                    tab = Controller.determineTab(tab);

                    layout.render();
                    App.main.show( layout );
                    EventsViewManage.API.setRegion( layout.content );

                    layout.sidebarLeft.show(calendar);
                    layout.header.show(tabsView);

                    tabsView.setTab( tab );

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

            var API = {
                showEvents: Controller.showEvents
            }

            ShowEvent.API = API;

        }
    })

})
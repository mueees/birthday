define([
    'app/app',
    'marionette',

    /*layouts*/
    'app/layouts/event/showEvent/layout',

    /*components*/
    'app/components/views/calendar/calendar',

    /*modules*/
    'app/modules/tab_event_range/module',
    'app/modules/eventsViewManage/module',
    'app/event/changeEvent/module'

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

                    App.channels.main.on(App.config.eventName.main.changeEvent, Controller.showEditView, this);

                    currentLayout.sidebarLeft.show(calendar);
                    currentLayout.header.show(tabsView);

                    tabsView.setTab( tab );

                },

                updateEventsViewTab: function(){
                    EventsViewManage.API.updateCurrentTab();
                },

                offAllListeners: function(){
                    App.channels.main.off(App.config.eventName.main.changeEvent, Controller.showEditView);
                    App.Event.ChangeEvent.off("eventUpdated", Controller.eventUpdated);
                    App.Event.ChangeEvent.off("eventRemove", Controller.eventRemove);
                    currentLayout = null;
                },

                showEditView: function( data ){

                    var done = _.bind(this._showChangeUserView, this);
                    var error = _.bind(this._errorShowChangeView, this);

                    $.when(App.Event.ChangeEvent.API.getChangeEvent( data )).done( done ).fail( error );
                },

                _showChangeUserView: function( changeView ){
                    App.Event.ChangeEvent.on("eventUpdated", Controller.eventUpdated);
                    App.Event.ChangeEvent.on("eventRemove", Controller.eventRemove);
                    currentLayout.edit.show( changeView );
                },

                _errorShowChangeView: function(){
                    console.log('WTF!');
                },

                eventUpdated: function(){
                    currentLayout.edit.close();
                    Controller.updateEventsViewTab();
                },

                eventRemove: function(){
                    currentLayout.edit.close();
                    Controller.updateEventsViewTab();
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
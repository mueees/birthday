define([
    'app/app',
    'marionette',

    'app/views/event/AddEvent/addEventView'
], function(App, Marionette, AddEventView){


    App.module("Event.AddEvent", {

        startWithParent: true,

        define: function(AddEvent, App, Backbone, Marionette, $, _){

            var Controller = {
                addEvent: function(){
                    var addEventView = this.getAddEventView();

                    var addNewEvent = _.bind(this.addEventOnServer, this);
                    addEventView.on('addNewEvent', addNewEvent);
                    App.main.show(addEventView);
                },

                addEventOnServer: function(data){
                    var success = _.bind(this.addEventOnServerSuccess, this);
                    var error = _.bind(this.addEventOnServerError, this);

                    $.when( App.request('event:saveNewEvent', data)).fail( error ).done( success );

                },

                addEventOnServerSuccess: function(data){
                    var event = data.model;
                    Backbone.history.navigate("/#event/" + event.get('_id'));
                },

                addEventOnServerError: function(){
                    console.log("WTF!");
                },

                getAddEventView: function(){
                    return new AddEventView();
                }
            }

            var API = {
                addEvent: function(){
                    Controller.addEvent();
                }
            }

            AddEvent.API = API;

        }
    })

})
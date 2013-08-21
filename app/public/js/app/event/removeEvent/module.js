define([
    'app/app',
    'marionette'
], function(App, Marionette){


    App.module("Event.RemoveEvent", {

        startWithParent: true,

        define: function(RemoveEvent, App, Backbone, Marionette, $, _){

            var Controller = {
                removeEvent: function( model ){
                    var _this = this;
                    model.destroy({
                        success: function(){
                            _this.trigger("successRemove");
                        },
                        error: function(){
                            _this.trigger("errorRemove");
                        }
                    });
                }
            }

            var API = {
                removeEvent: RemoveEvent.removeEvent
            }

            RemoveEvent.API = API;

        }
    })

})
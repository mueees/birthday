define([
    'app/app',
    'marionette',

    /*views*/
    './views/StandartWindowView'
], function(App, Marionette, StandartWindowView){

    App.module("Windows", {

        startWithParent: true,

        define: function(Windows, App, Backbone, Marionette, $, _){

            var WindowModel = Backbone.Model.extend();

            var defaultOpt = {
                title: "Window",
                customClass: ""
            }

            var Controller = {
                factory: function( options ){
                    var opts = _.extend(defaultOpt, options);
                    var windowModel = new WindowModel( opts );
                    return new StandartWindowView({model:windowModel});
                }
            }

            var API = {
                factory: Controller.factory
            }

            Windows.API = API;

        }
    })

})
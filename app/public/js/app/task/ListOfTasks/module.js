define([
    'app/app',
    'marionette'
], function(App, Marionette){


    App.module("Task.ListOfTasks", {

        startWithParent: true,

        define: function(ListOfTasks, App, Backbone, Marionette, $, _){

            var Task = App.module('Task');

            var Controller = {
                showListOfTasks: function( options ){

                }
            }

            var API = {
                showListOfTasks: Controller.showListOfTasks
            }

            ListOfTasks.API = API;

        }
    })

})
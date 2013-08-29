define([
    'jquery',
    'backbone',
    'marionette',
    'app/app',

    /*layouts*/
    'app/layouts/task/layout',

    /*module*/
    'app/task/ListOfTasks/module',
    'app/task/Menu/module'

], function(jQuery, Backbone, Marionette, App, TasksLayout){

    App.module("Task", {
        startWithParent: false,

        define: function( Task, App, Backbone, Marionette, $, _ ){

            var options = {
                defaultListName: 'main'
            }

            var ListOfTasks = App.module('Task.ListOfTasks');
            var Menu = App.module('Task.Menu');

            var tasksLayout;

            var Controller = {
                showTaskManager: function( region ){
                    tasksLayout = new TasksLayout();
                    region.show( tasksLayout );

                    //show Menu
                    Menu.API.showMenu({
                        region: tasksLayout.menuContainer
                    });

                    Task.Channel.on("listChanged", Controller.showListOfTasks);

                },

                showListOfTasks: function( data ){

                    //show list of tasks
                    ListOfTasks.API.showListOfTasks({
                        region: tasksLayout.listContainer,
                        nameList: data.nameList,
                        idList: data.nameList
                    });

                }
            }

            var API  = {
                showTaskManager: Controller.showTaskManager
            }

            Task.API = API;
            Task.Channel = _.extend({}, Backbone.Events);

        }
    })


})
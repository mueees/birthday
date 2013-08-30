define([
    'app/app',
    'marionette',

    /*views*/
    'app/views/task/ListOfTasks/listOfTasks'


], function(App, Marionette, ListOfTasksView){


    App.module("Task.ListOfTasks", {

        startWithParent: true,

        define: function(ListOfTasks, App, Backbone, Marionette, $, _){

            var Task = App.module('Task');

            var Controller = {
                showListOfTasks: function( options ){
                    var done = _.bind(Controller.getTasksSuccess, this);
                    var error = _.bind(Controller.getTasksError, this);

                    //запросить все таски с этого листа
                    $.when( App.request('task:getTasks', {_id: options._id})).fail( error ).done(function(data){
                        done( data, options );
                    });

                    //отрендерить их
                    //вставить в регион

                },

                getTasksSuccess: function( data, options ){
                    var taskCollection = data.taskCollection;
                    var listOfTasksView = new ListOfTasksView({
                        listName: options.name,
                        taskCollection: taskCollection
                    });
                    options.region.show(listOfTasksView);
                },

                getTasksError: function(){
                    console.log("WTF!");
                }
            }

            var API = {
                showListOfTasks: Controller.showListOfTasks
            }

            ListOfTasks.API = API;

        }
    })

})
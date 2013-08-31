define([
    'app/app',
    'backbone',
    'marionette',
    'app/models/task/task',
    'app/collections/_base/collection'
],function(App, Backbone, Marionette, TaskModel, BaseColletion){

    return BaseColletion.extend({
        model: TaskModel,
        url: App.config.api.getTasks,

        isHaveNewTask: function(){

            /*this.each(function(model){
                debugger
            })*/

            var newTask = this.filter(function(model){
                return !model.get('isSaved')
            });

            return (newTask.length) ? newTask[0] : false;

        }
    })

})
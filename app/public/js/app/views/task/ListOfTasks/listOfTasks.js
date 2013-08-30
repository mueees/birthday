define([
    'marionette',

    /*templates*/
    'text!app/templates/task/ListOfTasks/container.html',
    'text!app/templates/task/ListOfTasks/oneTask.html',

    /*views*/
    'app/views/task/ListOfTasks/oneTask'

], function(Marionette, containerTemp, oneTaskTemp, OneTaskView){

    return Marionette.ItemView.extend({

        containerTemp: _.template(containerTemp),
        oneTaskTemp: _.template(oneTaskTemp),

        events: {
            "click .list": "tryAddNewTask"
        },

        ui: {

        },

        initialize: function( options ){
            this.listName = options.listName;
            this.taskCollection = options.taskCollection;

            this.listenTo(this.taskCollection, "add", this.addNewTask)

        },

        render: function(){
            var container = this.containerTemp({listName: this.listName});
            container = $(container);

            this.taskCollection.each(function(model){
                var oneTask = new OneTaskView(model);
                container.find(".list").append( oneTask.$el );
            })

            this.$el.html(container);
        },

        tryAddNewTask: function(e){
            var el = $(e.target);

            if( !el.hasClass("list") ) return false;

            //если уже существует
            var newTask = this.taskCollection.isHaveNewTask();

            this.taskCollection.push({
                listId: this.listName
            });
        },

        addNewTask: function( model ){
            var oneTask = new OneTaskView(model);
            this.$el.find('.list').append( oneTask.$el );
            oneTask.focusToTitle();
        }
    })

})
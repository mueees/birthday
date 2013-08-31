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
            "click .addNewTask": "tryAddNewTask"
        },

        ui: {

        },

        initialize: function( options ){
            this.listName = options.listName;
            this.listId = options.listId;
            this.taskCollection = options.taskCollection;

            this.listenTo(this.taskCollection, "add", this.addNewTask)

        },

        render: function(){
            var _this = this;
            var container = this.containerTemp({listName: this.listName});
            this.$el.html(container);

            this.taskCollection.each(function(model){
                var oneTask = new OneTaskView({model:model});
                _this.$el.find(".list").append( oneTask.$el );
            })
        },

        tryAddNewTask: function(e){
            e.preventDefault();
            var el = $(e.target);

            //если уже существует
            var newTask = this.taskCollection.isHaveNewTask();
            if( newTask ){
                newTask.trigger("focusMe");
            }else{
                this.taskCollection.push({
                    listId: this.listId
                });
            }

            return false;
        },

        addNewTask: function( model ){
            var oneTask = new OneTaskView({model:model});
            this.$el.find('.list').append( oneTask.$el );
            oneTask.focusToTitle();
        }
    })

})
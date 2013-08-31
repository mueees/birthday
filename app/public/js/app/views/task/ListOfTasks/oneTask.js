define([
    'marionette',
    'text!app/templates/task/ListOfTasks/oneTask.html'
], function(Marionette, template){

    return Marionette.ItemView.extend({
        template: _.template(template),

        events: {
            "blur .title": "saveTask",
            "change .isDone": "changeIsDone"
        },

        ui: {
            title: ".title"
        },

        initialize: function(){
            this.render();
            //this.focus();

            this.listenTo(this.model, "focusMe", this.focusToTitle);
            this.listenTo(this.model, "destroy", this.close);
            this.listenTo(this.model, "change:isDone", this.saveTask);
        },

        focusToTitle: function(){
            this.ui.title.focus();
        },

        saveTask: function(e){

            var data = this.getData();
            if( !data.title ) {

                //уже сохранен на сервере, надо его удалить оттуда
                if( this.model.get("isSaved") ){
                    this.model.destroy();
                }

                return false;

            }

            this.model.set("isSaved", true);
            this.model.set(data);
            this.model.save();

            return false;
        },

        changeIsDone: function(e){
            var isDone = this.model.get("isDone");
            this.model.set("isDone", !isDone);
        },

        getData: function(){
            return {
                title: $.trim(this.ui.title.val())
            }
        }
    })

})
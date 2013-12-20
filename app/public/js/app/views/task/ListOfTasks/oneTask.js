define([
    'marionette',
    'text!app/templates/task/ListOfTasks/oneTask.html',
    'datepicker'
], function(Marionette, template){

    return Marionette.ItemView.extend({
        template: _.template(template),

        events: {
            "blur .title": "saveTask",
            "blur .description": "saveTask",
            "change .isDone": "changeIsDone",
            "click .showMore": "switchMore"
        },

        ui: {
            title: ".title",
            more: ".more",
            date: ".date",
            description: ".description"
        },

        initialize: function(){
            this.render();

            this.listenTo(this.model, "focusMe", this.focusToTitle);
            this.listenTo(this.model, "destroy", this.close);
            this.listenTo(this.model, "change:isDone", this.saveTask);
        },

        onRender: function(){
            var _this = this;
            this.ui.date.datepicker().on('changeDate', function(ev) {
                _this.saveTask();
            })
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
                title: $.trim(this.ui.title.val()),
                date: this.ui.date.val(),
                description: this.ui.description.val()
            }
        },

        switchMore: function(e){
            if(e) e.preventDefault();
            var selected = this.ui.more.is(':hidden');
            this.ui.more.toggleClass('off', !selected);
        }
    })

})
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
            "blur .date": "saveTask",
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

            if( this.model.get("date") ){
                this.ui.date.datepicker('setDate', this.model.get("date"));
            }
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

            if( !data.date ){
                this.model.set("date", null, {silent: true});
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

            var result = {
                title: $.trim(this.ui.title.val()),
                description: this.ui.description.val()
            }

            if( this.ui.date.val() ){
                result.date = this.ui.date.val();
            }

            return result;
        },

        switchMore: function(e){
            if(e) e.preventDefault();
            var selected = this.ui.more.is(':hidden');
            this.ui.more.toggleClass('off', !selected);
        }
    })

})
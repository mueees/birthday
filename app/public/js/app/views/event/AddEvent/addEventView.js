define([
    'marionette',
    'text!app/templates/event/addEvent/addEvent.html',

    'validate',
    'datepickerTime',
    'datepicker',
    'timepicker'
], function(Marionette, template){

    //todo: добавить валидацию, если выбран период повтора неделя, должны быть выбраны и дни
    //todo: дата старта не может быть позже даты окончания


    return Marionette.ItemView.extend({
        template: _.template(template),

        events: {
            "change #repeatType": "selectRepeatType",
            "click .btnAddEvent": "btnAddEvent",
            "click .ends .never" : "neverCheckbox",
            "click .ends .on" : "onCheckbox"
        },

        ui: {
            "repeatType": "#repeatType",
            "date": "#date",
            "hourStart": "#hourStart",
            "hourEnd": "#hourEnd",
            "dateRepeatEnd": "#dateRepeatEnd",
            "hour": "#hour",
            "daysArea" : ".days",
            "daysInput" : ".weekDays",
            "endsArea" : ".ends",
            "form" : ".addEventForm",
            "title" : "#title",
            "description": "#description",
            "endsInput": ".repeatEnds"
        },

        initialize: function(){

        },

        onRender: function(){
            this.addValidate();
            this.addDatePickerDate();
        },

        addValidate: function(){

            var form = this.ui.form;

            form.validate({
                rules: {
                    title: {
                        minlength: 3
                    },
                    date:{
                        required: true
                    }
                }
            });

        },

        addDatePickerDate: function(){

            var _this = this;

            this.ui.dateRepeatEnd.datepicker({
            });

            this.ui.date.datepicker().on("changeDate", function(e){

                var data = e.date.getFullYear() +"-"+ e.date.getMonth() +"-"+ e.date.getDate();
                $('#dateRepeatEnd').datepicker('setStartDate', '2014-01-01');
            });
            this.ui.hourStart.timepicker({
                minuteStep: 30,
                showMeridian: false
            });
            this.ui.hourEnd.timepicker({
                minuteStep: 30,
                showMeridian: false
            });


        },

        selectRepeatType: function(){
            var repeatType = this.ui.repeatType.val();
            if( !repeatType ) return false;

            /*ends*/
            if( repeatType == "no" ){
                this.hideEnds();
            }else{
                this.showEnds();
            }

            /*days*/
            if( repeatType == 2 ){
                this.showDays();
            }else{
                this.hideDays();
                this.clearDays()
            }
        },

        neverCheckbox: function(){
            this.ui.dateRepeatEnd.hide();
            this.ui.dateRepeatEnd.val("");
        },

        onCheckbox: function(){
            this.ui.dateRepeatEnd.show();
        },

        showDays: function(){
            this.ui.daysArea.show();
        },
        hideDays: function(){
            this.ui.daysArea.hide();
        },
        clearDays: function(){
            this.ui.daysInput.prop('checked', false);
        },
        showEnds: function(){
            this.ui.endsArea.show();
        },
        hideEnds: function(){
            this.ui.endsArea.hide();
        },

        getData: function(){

            var repeatType = this.ui.repeatType.val();

            var data = {
                title: this.ui.title.val(),
                description: this.ui.description.val(),
                dateStart: this.getDateStart(),
                repeat: {
                    repeatType: repeatType
                }
            }

            if( repeatType != 'no' ){

                data.repeat.repeatEnds = this.ui.endsInput.filter(":checked").val();

                //we should have end date
                if( data.repeat.repeatEnds == 2 ){
                    data.repeat.dateRepeatEnd = this.getDateRepeatEnd();
                }

                //this is every week
                if( repeatType == 2 ){
                    data.repeat.repeatDays = this.getDays();
                }

                //this is Every weekday (Monday to Friday)
                if( repeatType == 3 ){
                    data.repeat.repeatDays = [2, 3, 4, 5, 6];
                }

                //this is Every Monday, Wednesday, Friday
                if( repeatType == 4 ){
                    data.repeat.repeatDays = [2, 4, 6];
                }

                //this is Every Tuesday, Thursday
                if( repeatType == 5 ){
                    data.repeat.repeatDays = [3, 5];
                }

            }

            return data;
        },

        getDays: function(){
            var elements = this.ui.daysInput.filter(":checked");
            var result = [];

            for( var i = 0; i < elements.length; i++ ){
                result.push( elements[i].value )
            }

            return result;
        },

        getDateStart: function(){
            var date = this.ui.date.data('datepicker').getDate();
            var start = this.ui.hourStart.val();
            var end = this.ui.hourEnd.val();

            var matchStart = start.match(/(\d\d):(\d\d)/);
            var matchEnd = end.match(/(\d\d):(\d\d)/);

            return {
                year: date.getFullYear(),
                month: date.getMonth(),
                day: date.getDate(),
                start: {
                    hour: matchStart[1],
                    minute: matchStart[2]
                },
                end: {
                    hour: matchEnd[1],
                    minute: matchEnd[2]
                },
                dateStartObj: date

            }
        },

        getDateRepeatEnd: function(){
            var date = this.ui.dateRepeatEnd.data('datepicker').getDate();

            return {
                repeatEndsObj: date,
                year: date.getFullYear(),
                month: date.getMonth(),
                day: date.getDate()
            }
        },

        valid: function(){
            var form = this.ui.form;
            return form.valid();
        },

        btnAddEvent: function(e){
            if(e) e.preventDefault();

            if( this.valid() ){
                var data = this.getData();
                this.trigger("addNewEvent", data);
            }else{
                console.log('WTF!');
            }
            return false;
        }

    })

})
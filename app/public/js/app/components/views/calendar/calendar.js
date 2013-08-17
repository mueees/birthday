define([
    'app/app',
    'marionette',
    'text!app/templates/components/calendar/calendar.html',

    'datepicker',
    'moment'
], function(App, Marionette, template){

    return Marionette.ItemView.extend({
        template: _.template(template),

        //определяет как отдавать дату
        type: null,

        //последняя выбранная дата
        date: null,

        //последний отправленный диапазон дат
        dateToNotify: null,

        events: {

        },

        ui: {
            "calendarUi" : ".calendar"
        },

        initialize: function(){
            _.bind(this.typeTabsChanged, this);
            App.channels.main.on( App.config.eventName.main.tabEventChanged, this.typeTabsChanged, this);
        },

        onRender: function(){
            this.addDatePickerDate();
        },

        addDatePickerDate: function(){
            var _this = this;
            this.ui.calendarUi.datepicker().on("changeDate", function(data){
                _this.dateChanged( data );
            })
        },

        dateChanged: function( data ){
            this.date  = data.date;
            this.dateToNotify  = this.getDateRange();
        },

        typeTabsChanged: function(data){
            if( !data.type ) return false;

            this.type = data.type;
            if( !this.date ) this.determineDate();
            this.dateToNotify  = this.getDateRange();

            App.channels.main.trigger( App.config.eventName.main.calendarChanged, {
                dt_range: this.dateToNotify,
                type: this.type
            })
        },

        determineDate: function(){
            this.date = this.ui.calendarUi.data('datepicker').getDate();
        },

        getDateRange: function(){
            if( this.type == 'agenda' ){
                return this.getForAgendaType();
            }
        },

        getForAgendaType: function(){

            var start, end;
            start = moment(this.date);
            end = start.clone();
            end.add('days', 30);
            return {
                start: start.format('DD-MM-YYYY'),
                end: end.format('DD-MM-YYYY')
            }
        }
    })

})
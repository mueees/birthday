define([

	'marionette',
	'text!app/templates/user/search/search.html',

    'datepicker'
	], function(Marionette, searchTemp){

		return Marionette.ItemView.extend({
			template: _.template(searchTemp),

            events: {
                "keyup #fio" : "notify",
                "change #month": "notify",
                "change #year": "notify"
            },

            ui: {
                "fio" : '#fio',
                "year": "#year",
                "month": "#month"
            },

            initialize: function(){

            },

            onRender: function(){
                this.addDatePickerMonth();
                this.addDatePickerYear();
            },

            addDatePickerMonth: function(){
                var _this = this;
                var month = this.ui.month;
                month.datepicker({
                    format: " mm",
                    viewMode: "months",
                    minViewMode: "months"
                }).on("changeDate", function(){_this.notify()})
            },

            addDatePickerYear: function(){
                var _this = this;
                var year = this.ui.year;
                year.datepicker({
                    format: " yyyy",
                    viewMode: "years",
                    minViewMode: "years"
                }).on("changeDate", function(){_this.notify()})
            },

            getData:function(){

                var data = {
                    fio: this.ui.fio.val(),
                    year: this.ui.year.val(),
                    month: this.ui.month.val()
                }

                return data;
            },

            notify: function(){

                var data = this.getData();
                this.trigger('filterChange', data);
            }
		})

})
define([

	'marionette',
	'text!app/templates/user/search/search.html',

    'datepicker'
	], function(Marionette, searchTemp){

		return Marionette.ItemView.extend({
			template: _.template(searchTemp),

            events: {
                "keyup #fio" : "notify",
                "keyup #age" : "notify",
                "change #month": "notify",
                "change #year": "notify",
                'click .clearSearch': "clearSearch"
            },

            ui: {
                "fio" : '#fio',
                "year": "#year",
                "month": "#month",
                "age": "#age"
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
                }).on("changeDate", function(){
                        setTimeout(function(){
                            _this.notify();
                        }, 200)
                    })
            },

            addDatePickerYear: function(){
                var _this = this;
                var year = this.ui.year;
                year.datepicker({
                    format: " yyyy",
                    viewMode: "years",
                    minViewMode: "years"
                }).on("changeDate", function(){
                        setTimeout(function(){
                            _this.notify();
                        }, 200)
                    })
            },

            getData:function(){

                var data = {
                    fio: $.trim(this.ui.fio.val()),
                    year: $.trim(this.ui.year.val()),
                    month: $.trim(this.ui.month.val()),
                    age: $.trim(this.ui.age.val())
                }

                return data;
            },

            notify: function(){
                var data = this.getData();
                this.trigger('filterChange', data);
            },

            clearSearch: function(e){
                if(e) e.preventDefault();

                this.ui.fio.val("");
                this.ui.year.val("");
                this.ui.month.val("");
                this.ui.age.val("");

                this.notify();

                return false;
            }
		})

})
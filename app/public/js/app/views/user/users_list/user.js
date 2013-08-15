define([
    'app/app',
    'marionette',
    'text!app/templates/user/users_list/oneUser.html'
], function( App, Marionette, template ){

    return Marionette.ItemView.extend({

        tagName: "li",

        template: _.template(template),

        events: {
            "click .delete": "deleteUser"
        },

        initialize: function(){
            this.listenTo(this.model, 'destroy', this.removeFromDom)
            this.listenTo( App.chanels.main, App.config.chanels.main.searchFilterChanged, this.searchFilter )
        },

        searchFilter: function(data){
            if( this.isConcurrence(data) ){
                this.$el.show();
            }else{
                this.$el.hide();
            }
        },

        isConcurrence: function( data ){

            var fioConcurrence = true,
                monthConcurrence = true,
                yearConcurrence = true;

            debugger

            if( data.fio ){
                fioConcurrence = this.isFioConcurrence(data.fio)
            }
            if( data.month ){
                monthConcurrence = this.isMonthConcurrence(data.month)
            }
            if( data.year ){
                yearConcurrence = this.isYearConcurrence(data.year)
            }

            if( fioConcurrence && monthConcurrence && yearConcurrence ){
                return true;
            }else{
                return false;
            }


        },

        isFioConcurrence: function( fio ){
            return true;
        },

        isMonthConcurrence: function(month){
            var dateBirthday = this.model.get('dateBirthday');

            if( dateBirthday.month == month ){
                return true;
            }else{
                return false;
            }
        },

        isYearConcurrence: function(year){
            var dateBirthday = this.model.get('dateBirthday');

            if( dateBirthday.year == year ){
                return true;
            }else{
                return false;
            }
        },

        deleteUser: function( e ){
            if(e) e.preventDefault();
            this.model.destroy();
        },

        removeFromDom: function(){
            this.remove();
        }
    })

})
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
            this.listenTo( App.channels.main, App.config.eventName.main.searchFilterChanged, this.searchFilter )
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
                yearConcurrence = true,
                ageConcurrence = true;

            if( data.fio ){
                fioConcurrence = this.isFioConcurrence(data.fio)
            }
            if( data.month ){
                monthConcurrence = this.isMonthConcurrence(data.month)
            }
            if( data.year ){
                yearConcurrence = this.isYearConcurrence(data.year)
            }
            if( data.age ){
                ageConcurrence = this.isAgeConcurrence(data.age)
            }

            if( fioConcurrence && monthConcurrence && yearConcurrence && ageConcurrence ){
                return true;
            }else{
                return false;
            }


        },

        isAgeConcurrence: function(value){
            var age = this.model.get('age');

            if( age == value ){
                return true;
            }else{
                return false;
            }
        },

        isFioConcurrence: function( value ){

            var name = this.model.get('name');
            var middleName = this.model.get('middleName');
            var surName = this.model.get('surName');

            name = name.toLowerCase();
            middleName = middleName.toLowerCase();
            surName = surName.toLowerCase();
            value = value.toLowerCase();

            var reg = new RegExp("^" + value);

            var nameConcurrence = name.search(reg);
            var middleNameConcurrence = middleName.search(reg);
            var surNameConcurrence = surName.search(reg);

            if( nameConcurrence === 0 || middleNameConcurrence == 0 || surNameConcurrence == 0 ){
                return true
            }else{
                return false
            }

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
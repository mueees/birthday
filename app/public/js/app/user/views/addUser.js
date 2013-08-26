define([
    'backbone',
    'marionette',
    'text!../templates/addUser.html',
    'text!../templates/addWish.html',
    'validate',
    'datepicker'
], function(Backbone, Marionette, templateView, addWishTemp){

    var AddUserView = Marionette.ItemView.extend({
        template: _.template( templateView ),
        addWishTemp: _.template(addWishTemp),

        events: {
            'click .btnCreateNewUser': "btnCreateNewUser",
            'click .addWish': 'addWish'
        },

        ui: {
            'form': "form.addNewUserForm",
            'datepicker': '.datepicker',

            /*input*/
            'nameInput': 'input[name="name"]',
            'surNameInput': 'input[name="surName"]',
            'middleNameInput': 'input[name="middleName"]',
            'birthdayInput': 'input[name="birthday"]',
            'phonesInput': 'input[name="phones[]"]',
            'emailsInput': 'input[name="emails[]"]',
            'skypesInput': 'input[name="skypes[]"]',
            'realAddressesInput': 'input[name="realAddresses[]"]',
            'wishesInput': 'input[name="wishes[]"]',


            /*area*/
            'wishes': '.wishes',

            /*button*/
            'btnAddWish': '.addWish',
            'btnAddPhone': '.addPhone',
            'btnAddEmail': '.addEmail',
            'btnAddSkype': '.addSkype',
            'btnAddAddress': '.addAdress'
        },

        initialize: function(){

        },

        addWish: function(e){
            if(e) e.preventDefault();
            var view = this.addWishTemp();
            this.ui.wishes.append( view );
            this.bindUIElements();
            return false;
        },

        onRender: function(){
            //addValidate
            this.addValidate();
            //addDatePicker
            this.addDatePicker();
        },

        addDatePicker: function(){
            var datepicker = this.ui.datepicker;
            datepicker.datepicker({
                viewMode: 'years'
            })
        },

        addValidate: function(){

            var form = this.ui.form;

            form.validate({
                rules: {
                    name: {
                        minlength: 3
                    },
                    bithday:{
                        required: true
                    }
                }
            });

        },

        valid: function(){
            var form = this.ui.form;
            return form.valid();
        },

        getData: function(){
            var data = {
                name: this.ui.nameInput.val(),
                surName: this.ui.surNameInput.val(),
                middleName: this.ui.middleNameInput.val(),
                dateBirthday: this.getBirthday(),
                phones: this.getValuesFromElement( this.ui.phonesInput ),
                emails: this.getValuesFromElement( this.ui.emailsInput ),
                skypes: this.getValuesFromElement( this.ui.skypesInput ),
                realAddresses: this.getValuesFromElement( this.ui.realAddressesInput ),
                wishes: this.getValuesFromElement( this.ui.wishesInput )

            }


            return this.filterData(data);
        },

        filterData: function(data){

            var key, value, isArray, isString;

            for( key in data ){
                value = data[key];

                if( value.length == 0 ){
                    delete data[key]
                }
            }

            return data;

        },

        getValuesFromElement: function( elementes ){
            var result = [];
            for( var i = 0; i < elementes.length; i++ ){
                if( elementes[i].value != "" ){
                    result.push( elementes[i].value )
                }
            }

            return result;
        },

        getBirthday: function(){
            var value = this.ui.birthdayInput.data('datepicker').getDate();
            return{
                year: value.getFullYear(),
                month: value.getMonth(),
                day: value.getDate()
            }

        },

        btnCreateNewUser: function(e){
            if(e) e.preventDefault();

            if( this.valid() ){
                var data = this.getData();
                this.trigger("addNewUser", data);
            }else{
                console.log('WTF!');
            }
            return false;
        }
    })

    return AddUserView

})
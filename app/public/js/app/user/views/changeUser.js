define([
    'backbone',
    'marionette',
    'text!app/templates/user/changeUser.html',
    'validate',
    'datepicker'
], function(Backbone, Marionette, templateView){

    var ChangeUserView = Marionette.ItemView.extend({
        template: _.template( templateView ),

        events: {
            'click .btnChangeUser': "btnChangeUser"
        },

        ui: {
            'form': "form.changeUserForm",
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

        initialize: function(){},

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
            return data;
        },

        getValuesFromElement: function( elementes ){
            var result = [];
            for( var i = 0; i < elementes.length; i++ ){
                result.push( elementes[i].value )
            }

            return result;
        },

        getBirthday: function(){
            var value = this.ui.birthdayInput.val();
            value = value.match(/(\d\d)-(\d\d)-(\d\d\d\d)/);
            return{
                year: value[3],
                month: value[2],
                day: value[1]
            }

        },

        valid: function(){
            var form = this.ui.form;
            return form.valid();
        },

        btnChangeUser: function(e){
            e.preventDefault();



            if( this.valid() ){
                var data = this.getData();
                this.trigger("changeUser", data);
            }else{
                console.log('error chnage')
            }

            return false;
        }
    })

    return ChangeUserView

})
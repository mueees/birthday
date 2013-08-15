define([
    'backbone',
    'marionette',
    'text!app/templates/user/changeUser.html',
    'text!../templates/addWish.html',
    'text!../templates/addPhone.html',
    'text!../templates/addEmail.html',
    'text!../templates/addSkype.html',
    'text!../templates/addAdress.html',
    'validate',
    'datepicker'
], function(Backbone, Marionette, templateView, addWishTemp, addPhoneTemp, addEmailTemp, addSkypeTemp, addAdressTemp){

    var ChangeUserView = Marionette.ItemView.extend({
        template: _.template( templateView ),
        addWishTemp: _.template(addWishTemp),
        addPhoneTemp: _.template(addPhoneTemp),
        addEmailTemp: _.template(addEmailTemp),
        addSkypeTemp: _.template(addSkypeTemp),
        addAdressTemp: _.template(addAdressTemp),

        events: {
            'click .btnChangeUser': "btnChangeUser",
            'click .addWish': 'addWish',
            'click .addPhone': "addPhone",
            'click .addEmail': "addEmail",
            'click .addSkype': "addSkype",
            'click .addAddress': "addAdress"
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
            'phones': '.phones',
            'emails': '.emails',
            'skypes': '.skypes',
            'adresses': '.adresses',

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
            return this.filterData(data);
        },

        filterData: function(data){
            var key, value;
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
        },

        addWish: function(e){
            if(e) e.preventDefault();
            var view = this.addWishTemp();
            this.ui.wishes.append( view );
            this.bindUIElements();
            return false;
        },

        addPhone: function(e){
            if(e) e.preventDefault();
            var view = this.addPhoneTemp();
            this.ui.phones.append( view );
            this.bindUIElements();
            return false;
        },

        addEmail: function(e){
            if(e) e.preventDefault();
            var view = this.addEmailTemp();
            this.ui.emails.append( view );
            this.bindUIElements();
            return false;
        },

        addSkype: function(e){
            if(e) e.preventDefault();
            var view = this.addSkypeTemp();
            this.ui.skypes.append( view );
            this.bindUIElements();
            return false;
        },

        addAdress: function(e){
            if(e) e.preventDefault();
            var view = this.addAdressTemp();
            this.ui.adresses.append( view );
            this.bindUIElements();
            return false;
        }
    })

    return ChangeUserView

})
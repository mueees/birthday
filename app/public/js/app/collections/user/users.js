define([
    'backbone',
    'marionette',
    'app/models/user/user',
    'app/collections/_base/collection'
],function(Backbone, Marionette, UserModel, BaseColletion){

    return BaseColletion.extend({
        model: UserModel,

        parse: function(response){
            for( var i = 0; i < response.length; i++ ){
                var user = response[i];

                debugger

                user.dateBirthdayObj = new Date(user.dateBirthdayObj);
                this.push(user);
            }

            return this.models;
        }
    })

})
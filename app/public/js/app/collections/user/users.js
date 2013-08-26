define([
    'app/app',
    'backbone',
    'marionette',
    'app/models/user/user',
    'app/collections/_base/collection'
],function(App, Backbone, Marionette, UserModel, BaseColletion){

    return BaseColletion.extend({
        model: UserModel,
        url: App.config.api.getUsers,

        parse: function(response){
            for( var i = 0; i < response.length; i++ ){
                var user = response[i];

                user.dateBirthdayObj = new Date(user.dateBirthdayObj);
                user.age = (function(){
                    var date = new Date().getFullYear() - user.dateBirthdayObj.getFullYear();
                    if( new Date().getMonth() < user.dateBirthdayObj.getMonth() )  date--;
                    return date;
                })()
                this.push(user);
            }

            return this.models;
        }
    })

})
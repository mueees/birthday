define([
    'backbone',
    'marionette',
    'app/models/user/user',
    'app/collections/_base/collection'
],function(Backbone, Marionette, UserModel, BaseColletion){

    return BaseColletion.extend({
        model: UserModel
    })

})
define([
    'backbone',
    'marionette',
    'app/models/user/user',
    'app/collections/_base/collection'
],function(Backbone, Marionette, BaseModel, BaseColletion){

    return BaseColletion.extend({
        model: BaseModel
    })

})
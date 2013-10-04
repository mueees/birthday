define([
    'backbone',
    'marionette',
    'app/models/_base/model'
    
],function(Backbone, Marionette, BaseModel){

    return BaseModel.extend({
        defaults: {
            idTweet: "",
            coordinates: {},
            created_at: "",
            number: "", // номер по счету
            photoUrl: "",
            fullName: "",
            screenName: "",
            text: "",
            time: ""
        },
        idAttribute: '_id'
    })

})
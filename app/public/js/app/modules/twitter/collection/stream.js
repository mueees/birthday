define([
    'backbone',
    'marionette',
    '../models/stream',
    'app/collections/_base/collection'
],function(Backbone, Marionette, StreamModel, BaseColletion){

    return BaseColletion.extend({
        model: StreamModel
    })

})
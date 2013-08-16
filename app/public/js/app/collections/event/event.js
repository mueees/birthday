define([
    'backbone',
    'marionette',
    'app/models/event/event',
    'app/collections/_base/collection'
],function(Backbone, Marionette, EventModel, BaseColletion){

    return BaseColletion.extend({
        model: EventModel
    })

})
define([
    'app/app',
    'backbone',
    'marionette',
    'app/models/event/eventToShow',
    'app/collections/_base/collection'
],function(App, Backbone, Marionette, EventToShowModel, BaseColletion){

    return BaseColletion.extend({
        model: EventToShowModel,
        url: App.config.api.getEventToShow
    })

})
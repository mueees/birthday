define([
    'app/app',
    'backbone',
    'marionette',
    '../models/stream',
    'app/collections/_base/collection'
],function(App, Backbone, Marionette, StreamModel, BaseColletion){

    return BaseColletion.extend({
        model: StreamModel,
        url: App.config.api.getStreams
    })

})
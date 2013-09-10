define([
    'app/app',
    'backbone',
    'marionette',
    'app/models/preset/preset',
    'app/collections/_base/collection'
],function(App, Backbone, Marionette, PresetModel, BaseColletion){

    return BaseColletion.extend({
        model: PresetModel,
        url: App.config.api.getPresets
    })

})
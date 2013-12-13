define([
    'app/app',
    'backbone',
    'marionette',
    '../models/monitor',
    'app/collections/_base/collection'
],function(App, Backbone, Marionette, MonitorModel, BaseColletion){

    return BaseColletion.extend({
        model: MonitorModel
    })

})
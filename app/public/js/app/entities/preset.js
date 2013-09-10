define([
    'jquery',
    'backbone',
    'marionette',
    'app/app',

    'app/collections/preset/preset',
    'app/models/preset/preset'

], function(jQuery, Backbone, Marionette, App, PresetCollection, PresetModel){

    var API = {

        saveNewPreset: function( data ){

            var preset = new PresetModel(data);
            var deferred = $.Deferred();

            preset.save(null,{
                success: function(model, data){
                    deferred.resolve({
                        model: new PresetModel(data)
                    })
                },
                error: function(model, xhr){
                    deferred.reject({
                        model: event,
                        xhr: xhr
                    })
                }
            });

            return deferred.promise();
        },

        getPresets: function(){
            var deferred = $.Deferred();
            this._getPresets(deferred);
            return deferred.promise();
        },

        _getPresets: function(deferred){

            var presetCollection = new PresetCollection();

            presetCollection.fetch({
                type: "POST",
                success: function(){
                    deferred.resolve({
                        presetCollection: presetCollection
                    });
                },
                error: function(){
                    deferred.resolve({});
                }
            });
        }
    }

    App.reqres.setHandler('preset:saveNewPreset', function( data ){
        return API.saveNewPreset( data );
    })

    App.reqres.setHandler('preset:getPresets', function( data ){
        return API.getPresets();
    })
})
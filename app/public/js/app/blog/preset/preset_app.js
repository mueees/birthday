define([
    'jquery',
    'backbone',
    'marionette',
    'app/app',

    /*views*/
    'app/views/blog/preset/addPresetView',

    /*modules*/
    'app/modules/notify/module'

], function(jQuery, Backbone, Marionette, App, AddPresetView){

    App.module("Blog.Preset", {
        startWithParent: false,

        define: function( Preset, App, Backbone, Marionette, $, _ ){


            /*modules*/
            var Notify = App.module("Notify");

            var Controller = {
                getAddPresetView: function(){
                    var addPresetView = new AddPresetView();

                    var addNewPreset = _.bind(this.addNewPreset, this);
                    addPresetView.on("addNewPreset", addNewPreset);

                    return addPresetView;
                },

                addNewPreset: function(data){
                    var success = _.bind(this.addNewPresetSuccess, this);
                    var error = _.bind(this.addNewPresetError, this);
                    $.when( App.request('preset:saveNewPreset', data)).fail( error ).done( success );
                },

                addNewPresetSuccess: function(data){
                    Notify.API.showNotify({text: "Preset added"});
                    App.channels.blog.trigger("addNewPreset", data);
                },
                addNewPresetError: function(){
                    console.log("WTF!");
                }
            }

            var API  = {
                getAddPresetView: function(){
                    return Controller.getAddPresetView();
                }
            }

            Preset.API = API;

        }
    })


})
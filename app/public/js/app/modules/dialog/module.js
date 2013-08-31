define([
    'app/app',
    'marionette',

    /*views*/
    './views/prompt',
    './views/confirm'
], function(App, Marionette, PromptView, ConfirmView){

    App.module("Dialog", {

        startWithParent: true,

        define: function(Dialog, App, Backbone, Marionette, $, _){

            var DialogModel = Backbone.Model.extend();

            var Controller = {
                factory: function( options ){

                    var dialogModel = new DialogModel( options );

                    if( options.type == "prompt" ){
                        return new PromptView({model:dialogModel});
                    }else if( options.type == "confirm" ){
                        return new ConfirmView({model:dialogModel});
                    }
                }
            }

            var API = {
                factory: Controller.factory
            }

            Dialog.API = API;

        }
    })

})
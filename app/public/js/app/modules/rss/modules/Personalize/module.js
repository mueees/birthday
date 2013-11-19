define([
    'app/app',
    'marionette',

    /*views*/
    './views/PersonalizeView',

    /*collections*/
    '../../collections/categories'

], function(App, Marionette, PersonalizeView, Categories){


    App.module("Rss.Personalize", {

        startWithParent: true,

        define: function(Personalize, App, Backbone, Marionette, $, _){

            /*modules*/
            var Notify = App.module("Notify");
            var Dialog = App.module('Dialog');
            /*Notify.API.showNotify({text: "Preset changed"});*/

            var Controller = {
                show: function( layout ){

                    //get all categories
                    var categories = new Categories();

                    categories.on('editFeed', function(){debugger})

                    categories.fetch().done(function(){

                        var personalizeView = new PersonalizeView({
                            collection: categories,
                            Dialog: Dialog
                        });

                        layout.main_rss.show(personalizeView);
                    });
                    
                }
            }

            Personalize.Controller = Controller;

        }
    })

})
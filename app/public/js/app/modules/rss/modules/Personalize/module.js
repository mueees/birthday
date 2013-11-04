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
            /*Notify.API.showNotify({text: "Preset changed"});*/

            var Controller = {
                show: function( layout ){

                    //get all categories
                    var categories = new Categories();
                    categories.fetch().done(function(categories){
                        var personalizeView = new PersonalizeView({collection: categories});
                        layout.main_rss.show(personalizeView);

                    });
                    
                }
            }

            Personalize.Controller = Controller;

        }
    })

})
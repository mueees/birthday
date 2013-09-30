define([
    'jquery',
    'backbone',
    'marionette',
    'app/app',

    /*views*/
    "./modules/addStream/views/AddStreamView",

    /*layout*/
    './layout/layout',

    /*modules*/
    "./modules/menu/module",
    'app/modules/notify/module'
], function(jQuery, Backbone, Marionette, App, AddStreamView, Layout){

    App.module("Twitter", {
        startWithParent: false,

        define: function( Twitter, App, Backbone, Marionette, $, _ ){


            /*modules*/
            var Notify = App.module("Notify");

            var layout;

            var Router = Marionette.AppRouter.extend({

                before: function(){
                    App.startSubApp( "Twitter", {} );
                },

                appRoutes: {
                    "twitter": "init"
                }

            })

            var Controller = {
                init: function(){

                    //создать layout
                    layout = new Layout();
                    layout.render();
                    App.main.show( layout );

                    var menu = Twitter.Menu.API.showMenu({
                        region: layout.menuContainer
                    });


                    //получить данные по group меню
                    //отрисовать и вставить меню

                },

                showAddStreamForm: function(){
                    var addStreamView = new AddStreamView({
                        channel: App.channels.twitter
                    });
                    layout.extendContainer.show(addStreamView);
                },



                saveNewStream: function(data){
                    var success = _.bind(this.saveNewStreamSuccess, this);
                    var error = _.bind(this.saveNewStreamError, this);

                    $.when( App.request('twitter:saveNewStream', data)).fail( error ).done( success );
                },

                saveNewStreamSuccess: function(data){
                    Notify.API.showNotify({text: "Stream created"});
                    App.channels.twitter.trigger("streamSaved", data);
                },

                saveNewStreamError: function(){
                    Notify.API.showNotify({text: "Cannot create created"});
                }

            }

            var API  = {
                init: Controller.init
            }


            App.addInitializer(function(){
                new Router({
                    controller: API
                })
            })

            /*Events*/
            App.channels.twitter.on("showAddStreamForm", Controller.showAddStreamForm);
            App.channels.twitter.on("saveNewStream", function(data){Controller.saveNewStream(data)});

        }
    })


})
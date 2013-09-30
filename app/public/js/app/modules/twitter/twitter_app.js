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
    "./modules/menu/module"
], function(jQuery, Backbone, Marionette, App, AddStreamView, Layout){

    App.module("Twitter", {
        startWithParent: false,

        define: function( Twitter, App, Backbone, Marionette, $, _ ){


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

                    //создать меню
                    var menu = Twitter.Menu.API.getMenu();
                    layout.menuContainer.show(menu);


                    //получить данные по stream меню
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

                saveNewStreamSuccess: function(){

                },

                saveNewStreamError: function(){

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
            App.channels.twitter.on("showAddStreamForm", Controller.showAddStreamForm)
            App.channels.twitter.on("saveNewStream", function(){
                Controller.saveNewStream();
            })

        }
    })


})
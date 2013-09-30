define([
    'app/app',
    'marionette',

    /*layout*/
    './layout/layout',

    /*views*/
    './views/StreamView',

    /*modules*/
    'app/modules/notify/module'


], function(App, Marionette, Layout,  StreamView){


    App.module("Twitter.Menu", {

        startWithParent: true,

        define: function(Menu, App, Backbone, Marionette, $, _){

            /*modules*/
            var Notify = App.module("Notify");
            /*Notify.API.showNotify({text: "Preset changed"});*/

            var Controller = {
                getMenu: function(){

                    var layout = new Layout();
                    layout.render();

                    var streamView = new StreamView({
                        channel: App.channels.twitter
                    });

                    layout.on("show", function(){
                        layout.streamContainer.show(streamView);
                    });

                    return layout;
                }
            }

            var API = {
                getMenu: function(){
                    return Controller.getMenu();
                }
            }

            Menu.API = API;

        }
    })

})
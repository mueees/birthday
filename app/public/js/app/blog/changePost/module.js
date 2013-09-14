define([
    'app/app',
    'marionette',

    /*views*/
    'app/views/blog/changePost/ChangePostView',

    /*modules*/
    'app/modules/notify/module'


], function(App, Marionette, ChangePostView){


    App.module("Blog.ChangePost", {

        startWithParent: true,

        define: function(ChangePost, App, Backbone, Marionette, $, _){

            /*modules*/
            var Notify = App.module("Notify");

            var Controller = {
                getChangePost: function(deferred, data){
                    if( !data || _.isArray(data) ){
                        deferred.reject({});
                        return false;
                    }

                    var done = _.bind(this.renderChangeView, this);
                    var error = _.bind(this.errorRequestPost, this);

                    $.when( App.request( 'post:getById', data.idEvent )).fail( error ).done(function(data){
                        done( data, deferred )
                    });

                },

                renderChangeView: function(data, deferred){
                    var model = data.model;

                    var view = new ChangePostView({
                        model: model
                    });

                    /*ChangeEvent.listenTo(view, "changeEvent", Controller.changeEvent);
                    ChangeEvent.listenTo(view, "removeEvent", Controller.removeEvent);*/

                    deferred.resolve(view);
                },

                errorRequestPost: function(){
                    Notify.API.showNotify({text: "Cannot download post"});
                }
            }

            var API = {
                getChangeEvent: function( data ){
                    var deferred = new $.Deferred();
                    Controller.getChangePost( deferred, data );
                    return deferred.promise();
                }
            }



            ChangePost.API = API;

        }
    })

})
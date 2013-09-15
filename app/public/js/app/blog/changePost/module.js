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
                getChangePostView: function(deferred, data){
                    if( !data || _.isArray(data) ){
                        deferred.reject({});
                        return false;
                    }

                    var done = _.bind(this.renderChangeView, this);
                    var error = _.bind(this.errorRequestPost, this);

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
                },

                getChangePostViewByModel: function( deferred, data ){

                    var _changePostByModel = _.bind(this._changePostByModel, this);

                    $.when( App.request('preset:getPresets')).fail(function(){
                        Notify.API.showNotify({text: "Cannot download presets"});
                        deferred.reject({});
                    }).done(function(presetData){
                            var presetCollection = presetData.presetCollection;
                            var view = new ChangePostView({
                                model: data.model,
                                presets: presetCollection
                            });
                            view.on('changePost', _changePostByModel);
                            deferred.resolve(view);
                        });
                },

                _changePostByModel: function(data){
                    var newData = data.newData;
                    delete newData['presets'];
                    data.model.set(newData, {silent: true});

                    data.model.save(null, {
                        success: function(){
                            Notify.API.showNotify({text: "Post changed"});
                            data.model.trigger("change:savePost");
                        },
                        error: function(){
                            Notify.API.showNotify({text: "Cannot change post"});
                        }
                    });
                }
            }

            var API = {
                getChangePostView: function( data ){
                    var deferred = new $.Deferred();
                    Controller.getChangePostView( deferred, data );
                    return deferred.promise();
                },

                getChangePostViewByModel: function( data ){
                    var deferred = new $.Deferred();
                    Controller.getChangePostViewByModel( deferred, data );
                    return deferred.promise();
                }


            }



            ChangePost.API = API;

        }
    })

})
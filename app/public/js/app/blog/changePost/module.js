define([
    'app/app',
    'marionette',

    /*views*/
    'app/views/blog/changePost/ChangePostView',

    /*modules*/
    'app/modules/notify/module',
    'app/blog/preset/preset_app',
    'app/modules/windows/module',
    'app/fileBrowser/fileBrowser_app'


], function(App, Marionette, ChangePostView){


    App.module("Blog.ChangePost", {

        startWithParent: true,

        define: function(ChangePost, App, Backbone, Marionette, $, _){

            /*modules*/
            var Preset = App.module('Blog.Preset');
            var Notify = App.module("Notify");
            var FileBrowser = App.module("FileBrowser");
            var Windows = App.module("Windows");

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
                    var _this = this;

                    $.when( App.request('preset:getPresets')).fail(function(){
                        Notify.API.showNotify({text: "Cannot download presets"});
                        deferred.reject({});
                    }).done(function(presetData){
                            var presetCollection = presetData.presetCollection;
                            var view = new ChangePostView({
                                model: data.model,
                                presets: presetCollection
                            });

                            var getFileBrowser = _.bind(_this.getFileBrowser, _this);

                            view.on('changePost', _changePostByModel);
                            view.on('chooseFile', function(){
                                getFileBrowser(view);
                            });

                            deferred.resolve(view);
                        });
                },

                getFileBrowser: function(addPostView){

                    var windowView = Windows.API.factory({
                        title: "Choose image",
                        customClass: "size-big"
                    });

                    var fileBrowserView = FileBrowser.API.getFileBrowser();
                    fileBrowserView.onShow();
                    fileBrowserView.clearContainer();

                    windowView.$el.find('.modal-body').append(fileBrowserView.layout.$el);

                    fileBrowserView.on('selectedFiles', function(data){
                        addPostView.setPreviewUrl(data.paths[0]);
                        windowView.hideWindow();
                    });

                    windowView.show();
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
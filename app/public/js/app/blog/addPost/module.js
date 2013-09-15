define([
    'app/app',
    'marionette',

    /*views*/
    'app/views/blog/addPost/addPostView',

    /*modules*/
    'app/blog/preset/preset_app',
    'app/modules/notify/module'

], function(App, Marionette, AddPostView){


    App.module("Blog.AddPost", {

        startWithParent: true,

        define: function(AddPost, App, Backbone, Marionette, $, _){

            var currentRegion;

            /*modules*/
            var Preset = App.module('Blog.Preset');
            var Notify = App.module("Notify");

            var Controller = {
                addPost: function( data ){

                    var addPostView = this.getAddPostView();
                    var addPresetView = this.getAddPresetView();

                    if( data.region ){
                        data.region.show(addPostView);
                    }else{
                        currentRegion.show(addPostView);
                    }
                    addPostView.$el.find('.extra-area').append(addPresetView.$el);

                    var addPostOnServer = _.bind(this.addPostOnServer, this);
                    var changePreset = _.bind(this.changePreset, this);
                    addPostView.on('addNewPost', addPostOnServer);
                    addPostView.on("changePreset", function(data){
                        changePreset(data, addPostView);
                    });

                    //add presetCollection

                    $.when( App.request('preset:getPresets', data)).fail().done(function(data){
                        AddPost.trigger('getPresetsCollection:internal', data.presetCollection);
                    });

                },

                changePreset: function(data, addPostView){
                    var ChangeView = Preset.API.getChangePresetView();
                    var changeView = new ChangeView(data);
                    changeView.render();

                    changeView.on("successChange", function(){
                        Notify.API.showNotify({text: "Preset changed"});
                    });


                    this.clearAllChangeView(addPostView);
                    addPostView.$el.find('.extra-area').append(changeView.$el);

                    return false;
                },

                clearAllChangeView: function(addPostView){
                    addPostView.$el.find('.extra-area .changePresetArea').remove();
                },

                addPostOnServer: function(data){
                    var success = _.bind(this.addPostSuccess, this);
                    var error = _.bind(this.addPostError, this);

                    $.when( App.request('blog:saveNewPost', data)).fail( error ).done( success );
                },

                addPostSuccess: function(){
                    Notify.API.showNotify({text: "Post saved"});
                },

                addPostError: function(){
                    alert("error saving");
                },

                getAddPostView: function(){
                    var addPostView = new AddPostView({
                        parent: AddPost
                    });
                    return addPostView;
                },

                getAddPresetView: function(){
                    var addPresetView = Preset.API.getAddPresetView();
                    addPresetView.render();
                    return addPresetView;
                }
            }

            var API = {
                addPost: function(){
                    Controller.addPost();
                },
                setRegion: function( region ){
                    currentRegion = region;
                }
            }

            AddPost.API = API;
            AddPost.listenTo( App.channels.blog, "changeMenu:addPost", function(data){Controller.addPost(data)} );
            AddPost.listenTo( App.channels.blog, "addNewPreset", function(data){ AddPost.trigger('addNewPreset:internal', data) } );

        }
    })

})
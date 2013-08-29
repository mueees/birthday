define([
    'app/app',
    'marionette',
    'text!app/templates/task/Menu/menu.html',

    /*modules*/
    'app/modules/dialog/module'

], function(App, Marionette, template){

    var Dialog = App.module('Dialog');

    return Marionette.ItemView.extend({

        template: _.template(template),

        events: {
            "click .renameList": "renameList",
            "click .deleteList": "deleteList",
            "click .newList": "newList"
        },

        ui: {

        },

        initialize: function(){

        },

        onRender: function(){

        },

        newList: function(e){
            e.preventDefault();

            var prompt = Dialog.API.factory({
                type: 'prompt',

                title: "New List",
                text: "Create a new list name"
            });

            prompt.show();
            return false;
        },

        deleteList: function(e){
            e.preventDefault();

            var confirm = Dialog.API.factory({
                type: 'confirm',

                title: "Attention",
                text: "Delete current list?"
            });

            confirm.show();
            return false;
        },

        renameList: function(e){
            e.preventDefault();

            var prompt = Dialog.API.factory({
                type: 'prompt',

                title: "Rename List",
                text: "Rename list to:"
            });

            prompt.show();
            return false;
        }
    })

})
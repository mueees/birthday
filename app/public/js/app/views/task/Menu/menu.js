define([
    'app/app',
    'marionette',

    /*templates*/
    'text!app/templates/task/Menu/menu.html',
    'text!app/templates/task/Menu/oneList.html',

    /*modules*/
    'app/modules/dialog/module',

], function(App, Marionette, template, oneListTemp){

    var Dialog = App.module('Dialog');

    return Marionette.ItemView.extend({

        template: _.template(template),
        oneListTemp: _.template(oneListTemp),

        events: {
            "click .renameList": "renameList",
            "click .deleteList": "deleteList",
            "click .newList": "newList",
            "click .listBtn": "listBtn"
        },

        ui: {
            "listNames": ".listNames ul"
        },

        initialize: function( options ){
            this.listCollection = options.listCollection;
            this.listenTo(this.listCollection, "add", this.addListToDom);
            _.bind(this.createNewList, this);
            _.bind(this.addListToDom, this);
        },

        render: function(){

            var view = this.template();
            this.$el.html(view);

            var _this = this;
            this.listCollection.each(function(model){
                _this.addListToDom(model);
            })

            this.chooseFirstList();
        },

        chooseFirstList: function(){

            this.$el.find('.listNames li a').first().trigger("click");
        },

        listBtn: function(e){
            if(e) e.preventDefault();

            var element = $(e.target);
            var li = element.closest('li');

            if( li.hasClass("active") ) return false;

            this.$el.find('.listNames ul li').removeClass('active');
            li.addClass("active");

            var id = element.attr('data-id');
            var listModel = this.listCollection.get(id);
            this.trigger("listSelected", {listModel:listModel});
        },

        newList: function(e){
            e.preventDefault();

            var prompt = Dialog.API.factory({
                type: 'prompt',

                title: "New List",
                text: "Create a new list name"
            });

            prompt.show();

            this.listenTo(prompt, "accept", this.createNewList);

            return false;
        },

        createNewList: function( data ){
            this.listCollection.create({
                name: data
            }, {wait: true})
        },

        addListToDom: function(model){
            var oneListView = this.oneListTemp(model.toJSON());
            this.$el.find('.listNames  ul').append( oneListView );
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
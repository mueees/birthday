define([
    'marionette',
    'text!../templates/PersonalizeView.html',
    '../views/CategoryView'
], function(Marionette, template, CategoryView){

    return Marionette.ItemView.extend({
        template: _.template(template),

        events: {

        },

        ui: {

        },

        className: "organize",

        initialize: function(options){
            this.Dialog = options.Dialog;
            this.collection = options.collection;

            this.listenTo(this.collection, "add", this.addNewCategory)
        },

        render: function(){
            var view = this.template();
            this.$el.html(view);
            this.renderCollection();
            this.newCategoryInteraction();
        },

        renderCollection: function(){
            var _this = this;
            this.collection.each(function(categoryModel){
                _this.renderCategory(categoryModel)
            })
        },

        newCategoryInteraction: function(){
            var _this = this;
            this.$el.find('.newCategory').droppable({
                drop: function(event, ui){
                    _this.drop( event, ui, _this );
                },
                over: function( event, ui ) {
                    _this.over(event, ui, _this);
                },
                out: function( event, ui ) {
                    _this.out(event, ui, _this);
                }
            });

        },

        addNewCategory: function(categoryModel){
            categoryModel.save(null, {
                params: categoryModel.getDataForUpdate()
            });
            this.renderCategory(categoryModel);
        },

        over: function(event, ui, _this){
            _this.$el.find('.newCategory').addClass("over");
        },

        out: function(event, ui, _this){
            _this.$el.find('.newCategory').removeClass("over");
        },

        drop: function( event, ui, _this ){
            _this.$el.removeClass("over");

            var prompt = this.Dialog.API.factory({
                type: 'prompt',

                title: "Create New Category",
                text: "Enter new category name"
            });

            prompt.show();

            _this.listenTo(prompt, "accept", function(newName){
                newName = $.trim(newName);
                if( !newName ) return false;

                var parentCategory = ui.draggable.data('parentCategory');
                var idFeed = ui.draggable.data('idFeed');

                var feeds = parentCategory.get('feeds');
                var feed = feeds.get(idFeed);
                feeds.remove(idFeed);

                _this.collection.add({
                    name: newName,
                    feeds: [feed.getDataForSave()]
                })
                parentCategory.save();

            });
        },

        renderCategory: function(categoryModel){
            var _this = this;
            var categoryView = new CategoryView({model: categoryModel});
            this.listenTo( categoryView, 'dropFeed', this.dropFeed);
            this.listenTo( categoryView, 'deleteCategory', this.deleteCategory);
            this.listenTo( categoryView, 'editCategory', this.editCategory);
            this.listenTo( categoryView, 'editFeed', function(feedModel){
                this.trigger('editFeed', feedModel);
            });
            this.listenTo( categoryView, 'deleteFeed', this.deleteFeed);

            this.$el.find('.categories').append(categoryView.$el);
        },



        dropFeed: function(options){
            debugger
            if( !options.idFeed ) return false;

            var feeds = options.parentCategory.get('feeds');
            var feed = feeds.get(options.idFeed);
            feeds.remove(options.idFeed);
            options.targetCategory.get('feeds').add([feed]);

            options.targetCategory.save();
            options.parentCategory.save();

        },

        deleteCategory: function(categoryModel){

            var confirm = this.Dialog.API.factory({
                type: 'confirm',

                title: "Delete Category",
                text: "Do you want delete <strong>" + categoryModel.get('name') + "</strong> category?"
            });

            confirm.show();

            this.listenTo(confirm, "accept", function(){
                categoryModel.destroy();
            });

        },

        deleteFeed: function(feedModel){
            var confirm = this.Dialog.API.factory({
                type: 'confirm',

                title: "Delete Feed",
                text: "Do you want delete <strong>" + feedModel.get('name') + "</strong> feed? </br ></br ><strong>Attention, you delete all related posts!</strong>"
            });

            confirm.show();

            this.listenTo(confirm, "accept", function(){
                feedModel.destroy();
            });
        },

        editCategory: function(categoryModel){
            var prompt = this.Dialog.API.factory({
                type: 'prompt',

                title: "Change Category",
                text: "Enter new category name"
            });

            prompt.show();

            this.listenTo(prompt, "accept", function(newName){
                newName = $.trim(newName);
                if( !newName ) return false;
                categoryModel.set('name', newName);
                categoryModel.update();
            });
        },

        onRender: function(){
            
        },

        serializeData: function(){
            return {}
        }
    })

})
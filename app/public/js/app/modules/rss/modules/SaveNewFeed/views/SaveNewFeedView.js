define([
    'marionette',
    'text!../templates/SaveNewFeedView.html',
    'text!../templates/newCategoryTemp.html'
], function(Marionette, template, newCategoryTemp){

    return Marionette.ItemView.extend({

        template: _.template(template),

        newCategoryTemp: _.template(newCategoryTemp),

        events: {
            'click .cancel': "cancelBtn",
            'blur #new_category': "blueNewCategory",
            'click .create' : "createNewFeed"
        },

        className: "addNewFeed",

        ui: {

        },

        initialize: function(options){
            this.categories = options.categories;
            this.feed = options.feed;

            this.listenTo(this.categories, "add", this.addNewCategory);

            this.render();
        },

        render: function(){
            var _this = this;
            var view = this.template({
                categories: _this.categories.toJSON(),
                feed: _this.feed.toJSON()
            });

            this.$el.html(view);
            setTimeout(function(){
                _this.$el.addClass("show");
            }, 100)
        },

        blueNewCategory: function(e){
            if(e) e.preventDefault();
            var $el = $(e.target),
                value = $.trim($el.val());

            if( !value ) return false;

            this.categories.add({
                name: value
            })

        },

        addNewCategory: function(categoryModel){
            var _this = this;

            categoryModel.save().done(function(){
                var el = _this.newCategoryTemp(categoryModel.toJSON());
                _this.$el.find('.category ul li').last().before(el);
                _this.$el.find('#new_category').val("");

            }).fail(function(){
                _this.trigger("errorText", "Cannot save category");
                debugger
            })
        },

        createNewFeed: function(){
            
        },

        cancelBtn: function(e){
            if(e) e.preventDefault();
            var _this = this;
            this.$el.removeClass("show");

            setTimeout(function(){
                _this.close();
            }, 1000);

        }
    })

})
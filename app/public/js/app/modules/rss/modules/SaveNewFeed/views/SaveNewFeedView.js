define([
    'marionette',
    'text!../templates/SaveNewFeedView.html',
    'text!../templates/newCategoryTemp.html',

    'async'
], function(Marionette, template, newCategoryTemp, async){

    return Marionette.ItemView.extend({

        template: _.template(template),

        newCategoryTemp: _.template(newCategoryTemp),

        events: {
            'click .cancel': "cancelBtn",
            'blur #new_category': "blueNewCategory",
            'blur .feed_name': "blurFeedName",
            "click .create": "createBtn",
            'click .category input': "checkedCategory"
        },

        className: "addNewFeed",

        ui: {
            'feed_name': '.feed_name'
        },

        initialize: function(options){
            this.categories = options.categories;
            this.feed = options.feed;

            this.listenTo(this.categories, "add", this.addNewCategory);
            this.listenTo(this.feed, "change:name", this.changeFeedName);

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
        blurFeedName: function(e){
            if(e) e.preventDefault();
            var $el = $(e.target),
                value = $.trim($el.val());

            if( !value ) {
                value =  "Default Name"
            }

            this.feed.set({
                name: value
            })
        },

        changeFeedName: function(){
            this.$el.find('.feed_name').val( this.feed.get('name') );
        },

        addNewCategory: function(categoryModel){
            var _this = this;

            categoryModel.save().done(function(){
                var el = _this.newCategoryTemp(categoryModel.toJSON());
                _this.$el.find('.category ul li').last().before(el);
                _this.$el.find('#new_category').val("");
                _this.checkedCategory();

            }).fail(function(){
                    _this.trigger("text", "Cannot save category");
                })
        },

        createBtn: function(e){
            if(e) e.preventDefault();
            var _this = this;

            var selectedCategory = this.getSelectedCategory();

            async.waterfall([
                function(cb){
                    _this.feed.save(null, {
                        params: _this.feed.getDataForSave()
                    }).done(function(){
                        cb(null);
                    }).fail(function(xhr){
                            cb(xhr);
                        })
                },
                function(cb){

                    _this.categories.each(function(category){

                        var idCategory = category.get('_id');
                        if( $.inArray(idCategory, selectedCategory) == -1 ) return false;

                        var feedsCollection = category.get('feeds');
                        feedsCollection.add({
                            _id: _this.feed.get('_id')
                        })
                    })

                    _this.categories.sync('update', _this.categories, {
                        params: _this.categories.getDataForUpdate(),
                        success: function(){
                            cb(null)
                        },
                        error: function(err){
                            cb(err)
                        }
                    })
                }
            ],function(err){
                if( err ){
                    alert(err);
                    return false;
                }
                _this.trigger("text", "Save feed");
                _this.cancelBtn();
            })
        },

        checkedCategory: function(){
            var selectedCategory = this.getSelectedCategory();
            if( !selectedCategory.length ){
                this.$el.find(".create").hide();
            }else{
                this.$el.find(".create").show();
            }
        },

        getSelectedCategory: function(){
            var result = [];
            this.$el.find('.category input:checked').each(function(){
                var $input = $(this);
                var categoryId = $input.closest('li').data('id')
                result.push(categoryId);
            })
            return result;
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
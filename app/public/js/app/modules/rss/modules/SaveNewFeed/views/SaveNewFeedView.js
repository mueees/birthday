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
            "click .create": "createBtn"
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

        addNewCategory: function(model){
            var _this = this;

            categoryModel.save().done(function(){
                var el = _this.newCategoryTemp(categoryModel.toJSON());
                _this.$el.find('.category ul li').last().before(el);
                _this.$el.find('#new_category').val("");

            }).fail(function(){
                    _this.trigger("text", "Cannot save category");
                })
        },

        createBtn: function(e){
            if(e) e.preventDefault();
            var _this = this;

            async.waterfall([
                function(cb){
                    _this.feed.save().done(function(){
                        cb(null);
                    }).fail(function(xhr){
                            cb(xhr);
                        })
                },
                function(cb){


                    _this.categories.each(function(category){
                        debugger
                        var feedsCollection = category.get('feeds');
                        feedsCollection.add({
                            _id: _this.feed.get('_id')
                        })
                    })
                    debugger

                    _this.categories.save()
                        .done(function(){debugger})
                        .fail(function(){debugger})
                }
            ],function(err){
                if( err ){
                    alert(err);
                    return false;
                }
                _this.trigger("text", "Cannot save feed");
            })
        },
        saveFeed: function(){

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
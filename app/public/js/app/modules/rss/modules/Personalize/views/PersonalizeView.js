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
            this.collection = options.collection;
        },

        render: function(){
            var view = this.template();
            this.$el.html(view);
            this.renderCollection();
        },

        renderCollection: function(){
            var _this = this;
            this.collection.each(function(categoryModel){
                _this.renderCategory(categoryModel)
            })
        },

        renderCategory: function(categoryModel){
            var categoryView = new CategoryView({model: categoryModel});
            this.$el.find('.categories').append(categoryView.$el);
        },

        onRender: function(){
            
        },

        serializeData: function(){
            return {}
        }
    })

})
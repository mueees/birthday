define([
    'marionette',
    'text!app/templates/blog/listPost/ListPostsView.html',

    /*views*/
    'app/views/blog/listPost/OnePostView'


], function(Marionette, template, OnePostView){

    return Marionette.ItemView.extend({
        template: _.template(template),

        className: "table table-striped span9",

        tagName: "TABLE",

        events: {

        },

        ui: {

        },

        initialize: function( data ){
            this.postCollection = data.postCollection;


        },

        render: function(){
            var _this = this;

            this.$el.html( this.template() );

            this.postCollection.each(function(post, i){

                var postView = new OnePostView({model:post});
                _this.listenTo(postView, "edit", _this.editOnePost);
                _this.listenTo(postView, "delete", function(data){
                    _this.trigger("delete", data)
                });

                _this.$el.find("tbody").append( postView.$el );

            })
        },

        editOnePost: function(data){
            this.trigger("edit", data);
            return false;
        }
    })

})
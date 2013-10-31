define([
    'marionette',
    'text!app/templates/blog/listPost/OnePostView.html'
], function(Marionette, template){

    return Marionette.ItemView.extend({
        template: _.template(template),

        tagName: "TR",

        events: {
            "click .editBtn": "editBtn",
            "click .deleteBtn": "deleteBtn"
        },

        ui: {

        },

        initialize: function(){
            this.listenTo(this.model, "change:title", this.changeTitle);
            this.listenTo(this.model, "change:savePost", this.render);
            this.listenTo(this.model, "destroy", this.close);
            this.render();
        },

        changeTitle: function(model){
        },

        editBtn: function(){
            this.trigger("edit", this.model);
            return false;
        },

        deleteBtn: function(e){
            if(e) e. preventDefault();

            this.trigger("delete", {
                model: this.model
            });
            //this.model.destroy();
        }
    })

})
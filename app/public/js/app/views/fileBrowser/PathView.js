define([
    'marionette',
    'text!app/templates/fileBrowser/PathView.html'
], function(Marionette, template){

    return Marionette.ItemView.extend({
        template: _.template(template),

        events: {
            "click a": "chooseFolder"
        },

        ui: {

        },

        initialize: function(data){
            this.channel = data.channel;

            _.bind(this.chooseFolder, this);

            this.path = data.path;
            this.listenTo(this.channel, "setNewPath", this.setNewPath);
        },

        setNewPath: function(data){
            this.path = data.path;
            this.render();
        },

        render: function(){

            var parts = this.path.split('/');
            parts = parts.filter(function(val) {
                if( val ) return val;
            });

            var view = this.template({
                parts: parts
            });
            this.$el.html(view);
        },

        chooseFolder: function(e){

            if(e) e.preventDefault();

            var li = $(e.target).closest("li"),
                index = li.index(),
                path = null,
                parts;

            if( index == 0 ){
                path = "/";
            }else{
                parts = this.path.split('/');
                parts = parts.filter(function(val) {
                    if( val ) return val;
                });
                parts = parts.slice( 0, index );

                path = "/" + parts.join("/") + "/";
            }

            this.channel.trigger("goToPath", {
                path: path
            });
        }
    })

})
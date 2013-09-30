define([
    'marionette',
    "text!../templates/StreamView.html"
], function(Marionette, template){

    return Marionette.ItemView.extend({

        template: _.template(template),

        events: {
            'click .addStream': 'addStream',
            'click .deleteBtn': 'deleteBtn'
        },

        ui: {

        },

        initialize: function(options){
            this.channel = options.channel;
            this.streamCollection = options.streamCollection;

            this.listenTo(this.channel, "streamSaved", this.addStreamToColl);

            //todo: hard-code... should paste only one view, without rerendering all view
            this.listenTo(this.streamCollection, "add", this.render);
        },

        render: function(){
            var view = this.template({
                streamCollection: this.streamCollection.toJSON()
            })

            this.$el.html(view);
        },

        addStream: function(){
            this.channel.trigger("showAddStreamForm");
        },

        deleteBtn: function(){
            this.channel.trigger("deleteStream");
        },

        addStreamToColl: function(data){
            this.streamCollection.add(data.model);
        }
    })

})
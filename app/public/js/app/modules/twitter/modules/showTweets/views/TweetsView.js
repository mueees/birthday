define([
    'marionette',
    'text!../templates/Tweets.html',

    /*views*/
    './TweetView'
], function(Marionette, template, TweetView){

    return Marionette.ItemView.extend({
        template: _.template(template),

        events: {

        },

        ui: {

        },

        initialize: function(data){
            this.collection = data.collection;

            //при добавлении твита в коллеция он вставляется в начало view
            this.listenTo(this.collection, "add", this.addTweet);

            //при удалении из коллекции осттветственно удаляется из дом

        },

        addTweet: function(model){
            var tweetView = new TweetView({model: model});
            tweetView.render();
            this.$el.find('ul').prepend(tweetView.$el);

            console.log( model.toJSON() );
        },

        onRender: function(){

        }
    })

})
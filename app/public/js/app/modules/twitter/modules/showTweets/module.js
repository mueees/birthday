define([
    'app/app',
    'marionette',

    /*collection*/
    './collections/tweets',

    /*views*/
    './views/TweetsView',

    /*modules*/
    'app/modules/notify/module'


], function(App, Marionette, TweetsColl, TweetsView){


    App.module("Twitter.ShowTweets", {

        startWithParent: true,

        define: function(ShowTweets, App, Backbone, Marionette, $, _){

            /*modules*/
            var Notify = App.module("Notify");
            /*Notify.API.showNotify({text: "Preset changed"});*/

            var Controller = {
                showStreamTweet: function(data){
                	var _this = this;

                	//создает коллекцию куда будет ложить вновь прибывшие твиты
                	var tweetsColl = new TweetsColl();

                	//создает view которой передает коллецию и 
                	var tweetsView = new TweetsView({collection: tweetsColl});

                		
                	//вставляет в регион
                	data.region.show(tweetsView);

                	//подписывается на поток твитов
					App.channels.websocket.on(App.config.s.twitter.newTweet, function(data){
						tweetsColl.add(data)
		                //_this.newTweet(data);
		            });
                	
                },
                showSavedTweets: function(){}
            }

            var API = {
                showStreamTweet: function(data){
                	Controller.showStreamTweet(data);
                }
            }

            ShowTweets.API = API;

        }
    })

})
var Twitter = require('twitterClient').Twitter;

var config = {
    "consumerKey": "CWlhcR4IX5FBbLrRzp0rQ",
    "consumerSecret": "CJ0SlJoqH0Mx71SMo4XctEJmtLVsjfcdZX99nq1CZfg",
    "accessToken": "388225833-iZj4lbObqQOAOBSX1zUhryF2r26m1cRgYiK0IHQi",
    "accessTokenSecret": "2gs7JkepZ7XHFFPoluSTiMKweTLDvQDZ2nSliMDKok",
    "callBackUrl": "http://bla.com"
}



var error = function (err, response, body) {

    for(var key in err ){
        console.log(key + ": " + err[key] );
    }

    //console.log('ERROR [%s]', err);
};
var success = function (data) {
    var i = 0;
    var tweets = JSON.parse(data);

    tweets.forEach(function(tweet){
        i++;
        //console.log(tweet.text);
    })

   // console.log(i);

};

var twitter = new Twitter(config);

var i = 0;
twitter.getFavorites({ screen_name: 'del_javascript', count: '2'}, error, success);
/*setInterval(function(){
    twitter.getFavorites({ screen_name: 'del_javascript', count: '2'}, error, success);
    console.log(i);
    i++;
}, 150)*/
/*


twitter.getUserTimeline({ screen_name: 'BoyCook', count: '10'}, error, success);
twitter.getMentionsTimeline({ count: '10'}, error, success);
twitter.getHomeTimeline({ count: '10'}, error, success);
twitter.getReTweetsOfMe({ count: '10'}, error, success);
twitter.getTweet({ id: '1111111111'}, error, success);
*/

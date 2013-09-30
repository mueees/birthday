var Twit = require('twit');

var T = new Twit({
    consumer_key:         "CWlhcR4IX5FBbLrRzp0rQ"
    , consumer_secret:      'CJ0SlJoqH0Mx71SMo4XctEJmtLVsjfcdZX99nq1CZfg'
    , access_token:         '388225833-iZj4lbObqQOAOBSX1zUhryF2r26m1cRgYiK0IHQi'
    , access_token_secret:  '2gs7JkepZ7XHFFPoluSTiMKweTLDvQDZ2nSliMDKok'
})

/*
T.get('search/tweets', { q: 'banana since:2011-11-11', count: 2 }, function(err, reply) {
    console.log(reply);
})
*/


var stream = T.stream('statuses/filter', { track: 'mango' })

stream.on('tweet', function (tweet) {
    console.log(tweet)
})
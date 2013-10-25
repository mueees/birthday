var FeedParser = require('feedparser')
    , fs = require('fs')
    , request = require('request')
    , feed = 'http://craphound.com/?feed=rss2';

request('http://v-fedotov.livejournal.com/data/rss')
    .on('error', function (error) {
        console.error(error);
    })
    .pipe(new FeedParser())
    .on('error', function (error) {
        console.error(error);
    })
    .on('meta', function (meta) {
        console.log(meta.title);
    })
    .on('readable', function() {
        var data, item;
        var stream = this;
        while (item = stream.read()) {
            console.log('Got article: %s', item.title || item.description);
        }
    });

/*
fs.createReadStream(feed)
    .on('error', function (error) {
        console.error(error);
    })
    .pipe(new FeedParser())
    .on('error', function (error) {
        console.error(error);
    })
    .on('meta', function (meta) {
        console.log('===== %s =====', meta.title);
    })
    .on('readable', function() {
        var stream = this, item;
        while (item = stream.read()) {
            console.log('Got article: %s', item.title || item.description);
        }
    });*/

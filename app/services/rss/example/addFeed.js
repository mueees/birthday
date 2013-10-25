require("mongooseDb");

var Feed = require('models/rss/feed');


var feed1 = Feed({
    url: "http://drugoi.livejournal.com/data/rss",
    name: "test1"
});

var feed2 = Feed({
    url: "http://kgb-ru.livejournal.com/data/rss",
    name: "test2"
});

var feed3 = Feed({
    url: "http://maps.livejournal.com/rdata/rss",
    name: "test3"
});

feed1.save();
feed2.save();
feed3.save();
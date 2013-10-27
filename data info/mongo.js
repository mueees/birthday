db.posts.find({}, {
    _id: false,
    date: 1
}, {
    sort: {
        date: -1
    }
}).pretty();

db.posts.find({}, {
    _id: false,
    id_feed: 1
}, {
    sort: {
        date: -1
    }
}).pretty();
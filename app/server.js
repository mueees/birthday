var express = require('express')
    , app = express();

app.listen(3000, function () {
    console.log('Listening on port ', 3000)
})

var Db = require('mongodb').Db,
    Server = require('mongodb').Server;

//console.log(Db)
var server = new Server('127.0.0.1', 1216)
var db = new Db('test', server, {safe: true});
var images = db.collection('images');


app.get('/', function (req, res) {
    var data = images.find({}).count();
    res.end(data + '')
})
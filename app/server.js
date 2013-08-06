var express = require('express'),
    app = express(),
    db = require("./db_connect");

app.listen(3000, function () {
    console.log('Listening on port ', 3000)
})

app.get('/', function (req, res) {
    db(function(err, connection){

        var test = connection.db('test');
        var image = test.collection("images");


        image.findOne(function(err, item){
            console.log(item);
        })

    })
})
var express = require('express'),
    app = express(),
    db = require("./db"),
    fsWorker = require("fsWorker"),
    route = require('./routes/route');

app.configure(function(){
    app.use(express.static(__dirname + '/public'));
    app.set('view engine', 'handlebars');
    app.use(express.bodyParser());
});

route(app);

app.listen(56897, function (err) {
    console.log(err)
})
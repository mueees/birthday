var express = require('express'),
    app = express(),
    db = require("./db"),
    route = require('./routes/route');

app.configure(function(){
    app.use(express.static(__dirname + '/public'));
    app.set('view engine', 'handlebars');
    app.use(express.bodyParser());
});

route(app);

app.listen(56898, function (err) {
    console.log(err)
})
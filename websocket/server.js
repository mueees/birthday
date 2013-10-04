var express = require('express'),
    app = express(),
    http = require('http');


app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + "/templates");
app.set('view engine', 'hbs');

app.use('/', function(req, res, next){
    res.render('index', {});
});

app.use(function(err, req, res, next){
    express.errorHandler()(err, req, res, next);
})

//create server
var server = http.createServer(app);
server.listen(56899);
require('socketServer/socketServer')(server);
console.log('server start');
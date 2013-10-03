var http = require('http');

var socketServer = require('socketServer'); // это конструктор сервера
var server = socketServer(); //создается новый объект сервера, ему необходим только http сервер

var httpServer = http.createServer(function(req, res){});

// регистрируются middleware на req запросы
//first variant
/*var route = require("route");
route(server);*/
//second variant
server.use( require('./middl') );

//регистрируются middleware на обработку входящих publish сообщений
//server.publish( require('./publish') );

server.start(httpServer);

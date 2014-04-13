/*
/dialog/authorize/?redirect_uri=http://localhost:56899&response_type=code&client_id=hTr5JEHDWqwFQdBkZd5HP

*/
var express = require('express'),
    app = express(),
    db = require("db"),
    route = require('./routes/route'),
    http = require('http'),
    HttpError = require('./error').HttpError,
    EmailSender = require('EmailSender'),
    SocketError = require('socketServer/error').SocketError,
    logger = require("libs/log")(module),
    config = require("config"),
    passport = require('passport'),
    oauth2 = require('oauth2');

require("mongooseDb");
app.use(express.favicon());

/*if( app.get('env') == "development" ){
    app.use(express.logger("dev"));
}else{
    app.use(express.logger("default"));File Browser
}*/

app.configure(function() {
    app.use(express.static(__dirname + '/public'));
    app.use(express.cookieParser());
    app.use(express.bodyParser({ keepExtensions: true, uploadDir: './tmp' }));
    app.use(express.session({
        secret: config.get("session:secret"),
        key: config.get("session:key"),
        "cookie": {
            "path": "/",
            "httpOnly": true,
            "maxAge": null
        }
    }));
    app.use(passport.initialize()); 
    app.use(passport.session());
    app.set('views', __dirname + "/templates");
    app.set('view engine', 'hbs');
});

//todo:remove
/*app.use(function(req, res, next){
    req.session.isHaveAccess = true;
    next();
})*/

// Passport configuration
require('auth');

// error handling
app.use( require("middleware/sendHttpError") );
//app.use( require("middleware/loadUser") );
app.use( require("middleware/publicVariable") );

//routing
route(app);
app.get('/authorize/test', 
    passport.authenticate('bearer', { session: false }),
    function(req, res) {
        logger.info('OK');
        res.send("ok");
    }
);




app.get('/dialog/authorize', oauth2.authorization);
app.post('/dialog/authorize/decision', oauth2.decision);


//404
app.use(function(req, res, next){
    logger.log('warn', { status: 404, url: req.url });
    //var emailSender = new EmailSender({text: "Status: 404. Url:" + req.url});
    //emailSender.send();

    res.status(404);
    res.render('error', { status: 404, url: req.url });
});

app.use(function(err, req, res, next){

    logger.log('error', { error: err });

    if( typeof err == "number"){
        err = new HttpError(err);
    }

    if( err instanceof HttpError ){
        res.sendHttpError(err);
        //emailSender = new EmailSender({text: err.status + err.message.error});
    }else{

        if( err.name == "AuthorizationError" ){
            res.sendHttpError(err);
            return false;
            //express.errorHandler()(err, req, res, next);
        }

        if( app.get("env") == "development" ){
            express.errorHandler()(err, req, res, next);
        }else{
            express.errorHandler()(err, req, res, next);
            res.send(500);
        }
    }

})

//create server
var server = http.createServer(app);
server.listen(config.get("port"));
logger.info("Web server listening: " + config.get("port"));


//create websocket server
var socketServer = require('socketServer/socketServer');
//add routing for client request
require('routes/websocket')(socketServer);
// default route
socketServer.use( function(req, res, next){
    res.send({
        errors: {
            message: "undefined request",
            status: 404
        }
    })
});
socketServer.use(function(err, req, res, next){

    if( typeof err == "number"){
        err = new SocketError(err);
    }

    if( err instanceof SocketError ){
        res.send({
            errors: {
                message: err.message,
                status: err.status
            }
        })
    }else if( err instanceof Error){

        res.send({
            errors: {
                message: err.message,
                status: 500
            }
        })

    }else{
        //process.env.NODE_ENV == "development"

        res.send({
            errors: {
                message: err,
                status: 500
            }
        });
    }
})

socketServer.start(server);

//start services
//require('services/rss/index');

//start cron
var cron = require('child_process').fork( __dirname + '/cron');
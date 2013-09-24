var express = require('express'),
    config = require("config"),
    app = express(),
    db = require("./db"),
    route = require('./routes/route'),
    http = require('http'),
    HttpError = require('./error').HttpError,
    EmailSender = require('EmailSender'),
    logger = require("libs/log")(module);

app.use(express.favicon());

/*if( app.get('env') == "development" ){
    app.use(express.logger("dev"));
}else{
    app.use(express.logger("default"));File Browser
}*/

app.use(express.bodyParser({ keepExtensions: true, uploadDir: './tmp' }));
app.use(express.cookieParser());
app.use(express.session({
    secret: config.get("session:secret"),
    key: config.get("session:key"),
    "cookie": {
        "path": "/",
        "httpOnly": true,
        "maxAge": null
    }
}));

app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + "/templates");
app.set('view engine', 'hbs');

//todo:remove

app.use(function(req, res, next){
    req.session.isHaveAccess = true;
    next();
})

// error handling
app.use( require("middleware/sendHttpError") );
app.use( require("middleware/loadUser") );

//routing
route(app);

//404
app.use(function(req, res, next){
    logger.log('warn', { status: 404, url: req.url });
    //var emailSender = new EmailSender({text: "Status: 404. Url:" + req.url});
    //emailSender.send();

    res.render('error', { status: 404, url: req.url });
});

app.use(function(err, req, res, next){

    logger.log('error', { error: err });
    var emailSender;


    if( typeof err == "number"){
        err = new HttpError(err);
    }

    if( err instanceof HttpError){
        res.sendHttpError(err);
        emailSender = new EmailSender({text: err.status + err.message.error});
    }else{

        if( app.get("env") == "development" ){
            express.errorHandler()(err, req, res, next);
        }else{
            res.send(500);
        }

        emailSender = new EmailSender({text: err.toString()});
    }
    emailSender.send();
})

http.createServer(app).listen(config.get("port"));
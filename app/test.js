/*
 MODULES REQUIRED TO RUN PROGRAM
 */
var connect = require('connect');
var http = require('http');
var fs = require('fs');
var crossroads = require('crossroads');
var proxy = require('http-proxy');
var url = require('url');
var base = "./examples";
var _host = 'localhost';
var p_map = {__dynamic:8000,__static:8124,__proxy:9000};

/*
 DEBUG CONSOLE LOGGER
 */
var debug = true;
var dlog = function () {
    var dmsg = "<DEBUG>: './dynprox.js' :: ";
    var arg_val = []
    for (a in arguments) arg_val.push(arguments[a]);
    var arg_str = arg_val.join(" : ");
    console.log(dmsg, arg_str)
}
if (debug) dlog("__dirname", base);

/*
 CUSTOME MIDDLEWARE FOR CONNECT
 */
// dynamic server request generator -- NB :: needs to be last in connect stack
var serve_dynamic = function (req, res, next) {
    crossroads.parse(req.url);
    res.end('Routing dynmiac request for '+req.url);
};
// track user data and print to console if debug set
var track_user = function (req, res, next) {
    req.session.username = req.session.username || req.cookies.username;
    var uname = req.session.username;
    if (debug) dlog("user identified", uname);
    next();
};
var set_user = function(req, res, next) {
    var p = url.parse(req.url, true);
    if (p.pathname='/setuser'&&p.query['username']) {
        u_str = 'username='+p.query['username'];
        if (debug) dlog("new Set-Cookie", u_str);
        res.setHeader('Set-Cookie', [u_str, 'Max-Age=600']);
        res.setHeader('Location', '/');
        res.statusCode = 302;
        res.end();
    } else {
        next();
    }
}
var clear_session = function (req, res, next) {
    if ('/clear' == req.url ) {
        if (debug) dlog('Action', 'Clearing Session')
        req.session = null;
        req.statusCode = 302;
        res.setHeader('Location', '/');
        res.end()
    } else {
        next()
    }
}

/*
 HTTP SERVERS
 */

// PROXY : internet facing routing proxy
proxy.createServer(function (req, res, p) {
    var route_dynamic_prefix = /^\/node\//;
    if (req.url.match(route_dynamic_prefix)) {
        p.proxyRequest(req, res, { host:_host,port:p_map.__dynamic});
    } else {
        p.proxyRequest(req, res, {host:_host,port:p_map.__static});
    }
}).listen(p_map.__proxy, function () {
        console.log("Proxy bound on "+p_map.__proxy);
    });

//  DYNAMIC FILE SERVER : uses crossroads for routing
//.. dynamic internal routing config
var dyn_pat = '/node/{id}/';
crossroads.addRoute(dyn_pat, function (id) {console.log('access node '+ id)});
//.. dynamic http server
http.createServer(connect()
        .use(connect.cookieParser('mumble'))
        .use(connect.cookieSession({key: 'tracking'}))
        .use(track_user)
        .use(serve_dynamic)
    ).listen(p_map.__dynamic, function () {
        console.log("Dynamic bound on "+p_map.__dynamic);
    });

// STATIC FILE SERVER
http.createServer(connect()
        .use(connect.favicon())
        .use(connect.logger('dev'))
        .use(connect.cookieParser('mumble'))
        //.use(connect.cookieSession({key: 'tracking'}))
        .use(set_user)
        .use(clear_session)
        .use(connect.static(base))
    ).listen(p_map.__static, function () {
        console.log("Static bound on "+p_map.__static);
    });
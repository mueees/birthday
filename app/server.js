var express = require('express'),
    app = express(),
    db = require("./db_connect"),
    route = require('./routes/route');




app.configure(function(){
    app.use(express.static(__dirname + '/public'));
    app.set('view engine', 'handlebars');
});
/*app.configure(function(){
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.session({ secret: 'topsecret' }));
    app.use(app.everyauth.middleware());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
});*/


route(app);

app.listen(3000, function () {
    console.log('Listening on port ', 3000)
})




/*app.get('/', function (req, res) {


    res.render("index1");
    db(function(err, db){

        var image = db.collection("images");


        image.findOne(function(err, item){
            console.log(item);
        })

    })

})*/
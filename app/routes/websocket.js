var twitterController = require("twitter/controller");

module.exports = function(crossroads){

    var news = crossroads.addRoute('/news/{param}');

    news.matched.add(function(res, req, next, param){
        console.log(1);
    });
    news.matched.add(function(res, req, next, param){
        console.log(2);
    });

    crossroads.addRoute('/twiiter/addLilstener', twitterController.addLilsteners);
    crossroads.addRoute('/twiiter/removeLilstener', twitterController.removeLilstener);

}
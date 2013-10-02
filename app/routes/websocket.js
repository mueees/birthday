var twitter = require("twitter");

module.exports = function(crossroads){

    //twitter
    crossroads.addRoute('/twitter/addListener', twitter.addListener);
    crossroads.addRoute('/twitter/changeChannel', twitter.changeChannel);

}
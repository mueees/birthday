config = require("config");

module.exports = function(req, res, next){
    res.locals.socketUrl = config.get("socketUrl");
    next();

}
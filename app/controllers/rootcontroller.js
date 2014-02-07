var HttpError = require('../error').HttpError;

exports.home = function(req, res, next) {
   res.render('index', {
   	user: (req.user) ? true : false
   });
}

exports.fileBrowser = function(req, res, next) {
    res.render('fileBrowser');
}
exports.angular = function(req, res, next) {
    res.render('angular');
}
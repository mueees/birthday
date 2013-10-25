var HttpError = require('../error').HttpError;

exports.home = function(req, res, next) {
   res.render('index');
}

exports.fileBrowser = function(req, res, next) {
    res.render('fileBrowser');
}
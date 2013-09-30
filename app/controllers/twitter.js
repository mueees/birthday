var async = require('async'),
    StreamModel = require('../models/twitter/sream'),
    HttpError = require('../error').HttpError;;


var controller = {
    saveNewStream: function(req, res, next){
        var stream = new StreamModel(req.body);

	    stream.save(function (err, stream, numberAffected) {
	    	if(err){
	    		return next( new HttpError(400, "Cannot save Stream") );
	    	}
	    	res.send(stream);
		})
    },

    getStreams: function(req, res, next){
        StreamModel.find({}, function(err, streams){
            if(err){
                return next( new HttpError(400, "Cannot get Streams") );
            }
            res.send(streams);
        });
    }
};

module.exports = controller;
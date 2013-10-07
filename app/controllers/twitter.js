var async = require('async'),
    StreamModel = require('../models/twitter/sream'),
    HttpError = require('../error').HttpError,
    crossroads = require('crossroads');

var controller = {

    //only ajax
    saveNewStream: function(req, res, next){
        var data = req.body || req.params;
        var stream = new StreamModel(data);

        stream.save(function (err, stream) {
            if(err){
                res.send({error: err});
                return false;
            }
            res.send(stream);
        })
    },

    //only ajax
    getStreams: function(req, res, next){
        StreamModel.find({}, function(err, streams){
            if(err){
                return next( new HttpError(400, "Cannot get Streams") );
            }
            res.send(streams);
        });
    },

    deleteStream: function(req, res, next){

        StreamModel.find({ _id: req.params.id }, function(err, streams){
            if(err){
                res.send({error: err});
                return false;
            }

            if( !streams.length ){
                res.send({error: {
                    code: 400,
                    message: "Cannot find stream"
                }});
                return false;
            }

            streams[0].remove(function(err, stream){
                if( err ){
                    res.send({error: err});
                    return false;
                }
                res.send();
            });

        })

    }
};

module.exports = controller;
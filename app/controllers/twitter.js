var async = require('async'),
    StreamModel = require('../models/twitter/sream'),
    SocketError = require('socketServer/error').SocketError;

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
                next( new SocketError(400, "Cannot get Streams") );
                return false;
            }
            res.send(streams);
        });
    },

    deleteStream: function(req, res, next){

        StreamModel.find({ _id: req.params._id }, function(err, streams){
            if(err){
                next( new SocketError(400, "Cannot find stream") );
                return false;
            }

            if( !streams.length ){
                next( new SocketError(400, "Cannot find stream") );
                return false;
            }

            streams[0].remove(function(err, stream){
                if( err ){
                    next( new SocketError(400, "Cannot remove stream") );
                    return false;
                }

                res.send();
            });

        })

    },

    updateStream: function(req, res, next){

        var _id = req.params._id;
        var update = req.params;
        delete update._id;

        StreamModel.update({ _id: _id }, update, function(err, numberAffected, raw){

            if(err){
                next( new SocketError(400, "Cannot update stream") );
                return false;
            }

            res.send({
                result: req.params
            })

        })
    }
};

module.exports = controller;
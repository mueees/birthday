var Doc = require('../models/doc/doc'),
	HttpError = require('error').HttpError;


var controller = {
	add: function(request, response, next){
        var doc = new Doc(request.body);

        doc.save(function(err){
            if(err){
                next( new HttpError(400, "Cannot save new doc") );
                return false;
            }
            response.send({
                _id: doc._id
            });
        })
	},

	delete: function(request, response, next){
		var id = request.params.id;
        if(!id){
            next( new HttpError(400, "Cannot find id") );
        }

        Doc.find({ _id: id }, function(err, docs){
            if(err){
                next( new HttpError(400, "Cannot find docs") );
                return false;
            }

            if( !docs.length ){
                next( new HttpError(400, "Docs length is 0") );
                return false;
            }

            docs[0].remove(function(err, category){
                if( err ){
                    next( new HttpError(400, "Cannot delete doc") );
                    return false;
                }

                response.send();
            });

        })
	},

	doc: function(request, response, next){
		var id = request.params.id;

		Doc.find({ _id: id }, function(err, docs){
            if(err){
                next( new HttpError(400, "Cannot find docs") );
                return false;
            }

            if( !docs.length ){
                next( new HttpError(400, "Doc length is 0") );
                return false;
            }

            response.send(docs[0]);

        })
	},

	docs: function(request, response, next){

		Doc.find({}, function(err, docs){
            if(err){
                next( new HttpError(400, "Cannot find docs") );
                return false;
            }

            console.log(docs);

            response.send(docs);

        })
	}
};

module.exports = controller;
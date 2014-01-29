var Tag = require('../models/tag/tag'),
	HttpError = require('error').HttpError;

var controller = {
	add: function(request, response, next){
		var data = request.body;

		if( !data.name || data.name.length == 0 ) next( new HttpError(400, "Cannot get name field") );

        var tag = new Tag(data);

        tag.save(function(err){
            if(err){
                next( new HttpError(400, "Cannot save new tag") );
                return false;
            }
            response.send({
                _id: tag._id
            });
        })
	},
	delete: function(request, response, next){
		var id = request.params.id;
        if(!id){
            next( new HttpError(400, "Cannot find id") );
        }

        Tag.find({ _id: id }, function(err, tags){
            if(err){
                next( new HttpError(400, "Cannot find tags") );
                return false;
            }

            if( !tags.length ){
                next( new HttpError(400, "Tags length is 0") );
                return false;
            }

            tags[0].remove(function(err, category){
                if( err ){
                    next( new HttpError(400, "Cannot delete tag") );
                    return false;
                }

                response.send();
            });

        })
	},
	edit: function(request, response, next){
		var id = request.params.id;
		var data = request.body;
		if( !data.name || data.name.length == 0 ) next( new HttpError(400, "Cannot get name field") );

		Tag.find({_id: id}, function(err, tags){
			if(err){
                next( new HttpError(400, "Cannot find tags") );
                return false;
            }

            if( !tags.length ){
                next( new HttpError(400, "Tags length is 0") );
                return false;
            }

            Tag.update({ _id: id }, { name: data.name }, function (err, numberAffected, raw) {
	            if(err){
	                next( new HttpError(400, "Cannot update tag") );
	                return false;
	            }

	            response.send({
	                name: data.name
	            });

	        });

		})
	},
	tags: function(request, response, next){
		Tag.find({}, function(err, tags){
            if(err){
                next( new HttpError(400, "Cannot find tags") );
                return false;
            }

            response.send(tags);

        })
	},
	tag: function(request, response, next){
		var id = request.params.id;

		Tag.find({ _id: id }, function(err, tags){
            if(err){
                next( new HttpError(400, "Cannot find tags") );
                return false;
            }

            if( !tags.length ){
                next( new HttpError(400, "Tag length is 0") );
                return false;
            }

            response.send(tags[0]);

        })
	}
};

module.exports = controller;
var BaseModel = require('../base/action'),
    util = require('util'),
    Feed = require('models/rss/feed'),
    Post = require('models/rss/post'),
    logger = require("libs/log")(module),
    _ = require('underscore');

function RecalculateHasReadLater(){}

util.inherits(RecalculateHasReadLater, BaseModel);

_.extend(RecalculateHasReadLater.prototype, {
    execute: function( id_feed ){

    	if( !id_feed ) return false;
        var hasReadLater;

    	Post.count({
    		readLater: true,
    		id_feed: id_feed
    	}, function (err, count) {
			if (err) {
				logger.log('info', "Cannot recalculate feed:hasReadLater property");
				return false;
			}

            if( count == 0 ){
                hasReadLater = false;
            }else if( count > 0 ){
                hasReadLater = true;
            }

			Feed.update({ _id: id_feed }, { hasReadLater: hasReadLater }, function(err, numberAffected, raw){
	            if(err){
	                logger.log('info', "Cannot set feed:hasReadLater property");
	                return false;
	            }
	        })
		});
    }
});

exports.RecalculateHasReadLater = RecalculateHasReadLater;
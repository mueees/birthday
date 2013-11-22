var BaseModel = require('../base/action'),
    util = require('util'),
    Feed = require('models/rss/feed'),
    Post = require('models/rss/post'),
    logger = require("libs/log")(module),
    _ = require('underscore');

function RecalculateUnread(){}

util.inherits(RecalculateUnread, BaseModel);

_.extend(RecalculateUnread.prototype, {
    execute: function( id_feed ){

    	if( !id_feed ) return false;

    	Post.count({
    		isRead: false,
    		id_feed: id_feed
    	}, function (err, count) {
			if (err) {
				logger.log('info', "Cannot recalculate feed:unread property");
				return false;
			}

			Feed.update({ _id: id_feed }, { unread: count }, function(err, numberAffected, raw){
	            if(err){
	                logger.log('info', "Cannot set feed:unread property");
	                return false;
	            }
	        })
		});
    }
});

exports.RecalculateUnread = RecalculateUnread;
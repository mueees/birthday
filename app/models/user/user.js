var underscore = require('underscore'),
	BaseModel = require('../_base/model'),
	util = require('util');


util.inherits(User, BaseModel);

function User(){}

_.extend(User, {
	getById: function(){
		
	}
})

module.exports = User;
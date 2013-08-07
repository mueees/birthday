var _ = require('underscore'),
	BaseModel = require('../_base/model'),
	util = require('util');

function User(data){
	this.data = data;
}
util.inherits(User, BaseModel);



_.extend(User.prototype, {

	validate: function( data ){
		return true;
	},

	save: function( data ){
	
		this.connection(function(err, db){

			db.collection('user').insert(data, function(err, result){
				console.log(result); 
			})

		})

	}

})



module.exports = User;
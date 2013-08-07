var UserModel = require('../models/user/user');

var controller = {
	user: {
		add: function(req, res){
			var data = req.body;
			var user = new UserModel( data );
			user.save();

			res.send( user.data );
		}
	}
}

module.exports = controller;
var UserModel = require('../models/user/user');

var controller = {
	user: {
		add: function(req, res){

			var user = new UserModel();
			res.send( user.type );
		}
	}
}

module.exports = controller;
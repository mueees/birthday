var UserModel = require('../models/user/user'),
    url = require('url');

var controller = {
	user: {
		add: function(req, response){

			var data = req.body;
            data['dateBirthdayObj'] = new Date( data.dateBirthday.year, data.dateBirthday.month, data.dateBirthday.day);

			var user = new UserModel( data );
            user.save(function(err, result){
                controller.user._add( err, result, response )
            });

		},

        _add: function( err, result, response ){

            if( err ){
                response.statusCode = 400;
                response.send(null);
            }else{
                response.send(result);
            }

        },

        deleteUser: function(request, response){
            var data = request.body;

            UserModel.deleteUser( data.id, function(err, result){
                controller.user._deleteUser( err, result, response )
            });
        },

        _deleteUser: function( err, result, response ){
            if( err ){
                response.statusCode = 400;
                response.send(null);
            }else{
                response.send(result);
            }
        },

        get: function( request, response ){
            var parts = url.parse( request.url, true );

            if( !parts.query.id ){
                response.send(null);
            }

            UserModel.get( parts.query.id, function(err, user){
                controller.user._get( err, user, response )
            });
        },

        _get: function(err, user, response){

            if( err ){
                response.statusCode = 400;
                response.send(err);
            }else{
                response.send(user.data);
            }
        },

        users: function(request, response){
            var parts = url.parse( request.url, true );
            var data = {};

            if( parts.query['month[]'] ){
                data.month = parts.query['month[]']
            }
            if( parts.query['year[]'] ){
                data.year = parts.query['year[]']
            }

            UserModel.getUsers(data, function(err, users){
                controller.user._users(  err, users, response )
            });

        },

        _users: function( err, users, response){


            debugger

            if( err ){
                response(err)
            }else{

                response(users);
            }

        }
	}
}

module.exports = controller;
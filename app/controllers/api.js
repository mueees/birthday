var UserModel = require('../models/user/user'),
    EventModel = require('../models/event/event'),
    url = require('url'),
    queryString = require( "querystring"),
    _ = require('underscore');

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
                response.send(result[0]);
            }

        },

        deleteUser: function(request, response){
            var id = request.params.id;

            UserModel.deleteUser( id, function(err, result){
                controller.user._deleteUser( err, result, response )
            });
        },

        _deleteUser: function( err, result, response ){
            if( err ){
                response.statusCode = 400;
                response.send(null);
            }else{
                if( result == 1){
                    response.statusCode = 200;
                }else{
                    response.statusCode = 400;
                }
                response.send();
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
                if( !_.isArray(data.month) ){
                    data.year = [data.year];
                }
            }
            if( parts.query['year[]'] ){
                data.year = parts.query['year[]']
                if( !_.isArray(data.year) ){
                    data.year = [data.year];
                }
            }

            UserModel.getUsers(data, function(err, users){
                controller.user._users(  err, users, response )
            });

        },

        _users: function( err, users, response){

            if( err ){
                response.statusCode = 400;
                response.send(err)
            }else{

                response.send(users);
            }

        },

        count: function(request, response){
            UserModel.getCount( function(err, count){
                controller.user._count( err, count, response )
            })
        },

        _count: function(err, count, response){

            if( err ){
                response.statusCode = 400;
                response.send(err);
            }else{
                response.send({
                    count: count
                });
            }

        },

        changeUser: function( request, response ){

            var data = request.body;

            data['dateBirthdayObj'] = new Date( data.dateBirthday.year, data.dateBirthday.month, data.dateBirthday.day);
            var user = new UserModel( data );
            user.update( function(err, result){
                controller.user._changeUser( err, result, response, user );
            })
        },

        _changeUser: function( err, result, response, user ){

            var status;

            if( err ){
                response.statusCode = 400;
                response.send(null);
            }else{
                if( result == 1){
                    status = 200;
                }else{
                    status = 400;
                }
                response.send(status, user.data);
            }
        }
    },

    event: {

        changeEvent: function(request, response){
            var data = request.body;

            if(data.dateStart.dateStartObj) data.dateStart.dateStartObj = new Date(data.dateStart.dateStartObj);


            if( data.repeat.repeatEnds == 2 ){
                data.repeat.dateRepeatEnd.repeatEndsObj = new Date(data.repeat.dateRepeatEnd.repeatEndsObj);
            }

            var event = new EventModel( data );
            event.update(function(err, result){
                controller.event._changeEvent( err, result, response, event )
            });
        },

        _changeEvent: function(err, result, response, event){
            var status;

            if( err ){
                response.statusCode = 400;
                response.send(null);
            }else{
                if( result == 1){
                    status = 200;
                }else{
                    status = 400;
                }
                response.send(status, event.data);
            }
        },

        add: function(request, response){
            var data = request.body;

            if(data.dateStart.dateStartObj) data.dateStart.dateStartObj = new Date(data.dateStart.dateStartObj);


            if( data.repeat.repeatEnds == 2 ){
                data.repeat.dateRepeatEnd.repeatEndsObj = new Date(data.repeat.dateRepeatEnd.repeatEndsObj);
            }

            var event = new EventModel( data );
            event.save(function(err, result){
                controller.event._add( err, result, response )
            });
        },

        _add: function( err, result, response ){

            if( err ){
                response.statusCode = 400;
                response.send(null);
            }else{
                response.send(result[0]);
            }

        },

        getEventsToShow: function(request, response ){
            var data = request.body;

            if( !data.dt_range ) {
                response.statusCode = 400;
                response.send("dt_range is necessary");
                return false;
            }

            data.dt_range.start.startObj = new Date(data.dt_range.start.startObj);
            data.dt_range.end.endObj = new Date(data.dt_range.end.endObj);

            EventModel.getEventsToShow( data, function(err, events){
                controller.event._getEventsToShow( err, events, response )
            });
        },

        _getEventsToShow: function( err, events, response ){

            if( err ){
                response.statusCode = 400;
                response.send(err);
            }else{
                response.send(events);
            }

        },

        get: function( request, response ){
            var id = request.params.id;

            EventModel.get( id, function(err, user){
                controller.event._get( err, user, response )
            });
        },

        _get: function(err, event, response){

            if( err ){
                response.statusCode = 400;
                response.send(err);
            }else{
                response.send(event.data);
            }
        },

        deleteEvent: function(request, response){
            var id = request.params.id;

            EventModel.deleteEvent( id, function(err, result){
                controller.event._deleteEvent( err, result, response )
            });
        },

        _deleteEvent: function(err, result, response){
            if( err ){
                response.statusCode = 400;
                response.send();
            }else{
                if( result == 1){
                    response.statusCode = 200;
                }else{
                    response.statusCode = 400;
                }
                response.send({});
            }
        }
    }
}

module.exports = controller;
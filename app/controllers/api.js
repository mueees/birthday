var UserModel = require('../models/user/user'),
    EventModel = require('../models/event/event'),
    TaskListModel = require('../models/task/taskList'),
    TaskModel = require('../models/task/task'),
    PostModel = require('../models/blog/post'),
    PresetModel = require('../models/preset/preset'),
    url = require('url'),
    jQuery = require( "jquery"),
    HttpError = require('error').HttpError,
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
    },

    task: {

        add: function(request, response){
            var data = request.body;

            if(data.date) data.date = new Date(data.date);


            var task = new TaskModel( data );
            task.save(function(err, result){
                controller.task._add( err, result, response )
            });
        },
        _add: function(err, result, response){
            if( err ){
                response.statusCode = 400;
                response.send(null);
            }else{
                response.send(result[0]);
            }
        },

        changeTask: function(request, response){
            var data = request.body;

            if(data.date) data.date = new Date(data.date);

            var task = new TaskModel( data );
            task.update(function(err, result){
                controller.task._changeTask( err, result, response, task )
            });
        },
        _changeTask: function(err, result, response, task){
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
                response.send(status, task.data);
            }
        },

        deleteTask: function(request, response){
            var id = request.params.id;

            TaskModel.deleteTask( id, function(err, result){
                controller.task._deleteTask( err, result, response )
            });
        },
        _deleteTask: function(err, result, response){
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
        },

        deleteTaskList:function(request, response){
            var id = request.params.id;

            TaskListModel.deleteTaskList( id, function(err, result){
                controller.task._deleteTaskList( err, result, response )
            });

            TaskModel.deleteTaskFromList(id);
        },
        _deleteTaskList: function(err, result, response){
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
        },

        getTaskLists: function(request, response){
            TaskListModel.getTaskLists( function(err, lists){
                controller.task._getTaskLists( err, lists, response )
            });
        },
        _getTaskLists: function(err, lists, response){
            if( err ){
                response.statusCode = 400;
                response.send(err);
            }else{
                response.send(lists);
            }
        },

        addTaskList: function(request, response){
            var data = request.body;

            var taskList = new TaskListModel( data );
            taskList.save(function(err, result){
                controller.task._addTaskList( err, result, response )
            });
        },
        _addTaskList: function(err, result, response){
            if( err ){
                response.statusCode = 400;
                response.send(null);
            }else{
                response.send(result[0]);
            }
        },

        getTasks: function(request, response){
            var parts = url.parse( request.url, true );

            if( !parts.query._id ){
                response.send(null);
            }

            TaskModel.getTasks( parts.query._id, function(err, events){
                controller.task._getTasks( err, events, response )
            });
        },
        _getTasks: function( err, tasks, response ){
            if( err ){
                response.statusCode = 400;
                response.send(err);
            }else{
                response.send(tasks);
            }
        }
    },

    blog: {
        addPost: function(request, response){

            var data = request.body;

            if(data.date) data.date = new Date(data.date);

            var post = new PostModel( data );

            post.save(function(err, result){
                controller.blog._addPost( err, result, response )
            });
        },

        _addPost: function( err, result, response ){

            if( err ){
                response.statusCode = 400;
                response.send(null);
            }else{
                response.send(result[0]);
            }

        },

        getPosts: function(request, response){
            PostModel.getPosts( request.user, function(err, posts){
                controller.blog._getPosts( err, posts, response );
            });
        },

        _getPosts: function( err, posts, response ){

            if( err ){
                response.statusCode = 400;
                response.send(err);
                return false;
            }

            var deffered = jQuery.Deferred();
            var defferedPromise = deffered.promise();
            defferedPromise.done(function(data){
                var postsToSend = controller.blog.mergePostPreset(posts, data.presets);
                response.send(postsToSend);
            });


            PresetModel.getPresets( function(err, presets){
                controller.blog._getPresets( err, presets, deffered );
            });
        },

        mergePostPreset: function(posts, presets){
            var result = [],
                i,
                max = posts.length,
                curPost,
                idPreset;

            for( i = 0; i < max; i++ ){
                curPost = posts[i];
                idPreset = curPost['preset'];

                curPost.preset = controller.blog.getPresetById(presets, idPreset);
                result.push(curPost);
            }
            return result;

        },

        getPresetById: function(presets, idPreset){
            var i,
                max = presets.length;

            for( i = 0; i < max; i++ ){
                if( presets[i]['_id'] ==  idPreset){
                    return presets[i];
                    break;
                }
            }
        },

        _getPresets: function(err, presets, deffered){

            deffered.resolve({
                presets: presets
            })
        },

        changePost: function(request, response){
            var data = request.body;

            if(data.date) data.date = new Date(data.date);


            var post = new PostModel( data );
            post.update(function(err, result){
                controller.blog._changePost( err, result, response, post )
            });
        },
        _changePost: function(err, result, response, post){
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
                response.send(status, post.data);
            }
        },

        deletePost: function(request, response){
            var id = request.params.id;

            PostModel.deletePost( id, function(err, result){
                controller.blog._deletePost( err, result, response )
            });
        },
        _deletePost: function(err, result, response){
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
    },

    preset: {
        addPreset: function(request, response){

            var data = request.body;

            var preset = new PresetModel( data );

            preset.save(function(err, result){
                controller.preset._addPreset( err, result, response )
            });
        },

        _addPreset: function( err, result, response ){

            if( err ){
                response.statusCode = 400;
                response.send(null);
            }else{
                response.send(result[0]);
            }

        },

        getPresets: function(request, response ){

            PresetModel.getPresets( function(err, presets){
                controller.preset._getPresets( err, presets, response )
            });
        },

        _getPresets: function(err, presets, response){
            if( err ){
                response.statusCode = 400;
                response.send(err);
            }else{
                response.send(presets);
            }
        },

        changePreset: function(request, response){
            var data = request.body;

            var preset = new PresetModel( data );
            preset.update(function(err, result){
                controller.preset._changePreset( err, result, response, preset )
            });
        },
        _changePreset: function(err, result, response, preset){
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
                response.send(status, preset.data);
            }
        }
    }
}

module.exports = controller;
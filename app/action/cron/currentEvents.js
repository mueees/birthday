var BaseModel = require('../base/action'),
    EmailAction = require('../email'),
    util = require('util'),
    _ = require('underscore'),
    async = require('async'),
    hbs = require('hbs'),
    template = require('templates/action/cron/currentEvents.hbs'),
    EventModel = require('../../models/event/event'),
    UserModel = require('../../models/user/user'),
    TaskModel = require('../../models/task/task');

function CurrentEvents(){}
util.inherits(CurrentEvents, BaseModel);

_.extend(CurrentEvents.prototype, {
    execute: function(){


        var data = {};
        data.dt_range = {};
        data.dt_range.end = {};
        data.dt_range.start = {};
        data.dt_range.start.startObj = new Date();
        data.dt_range.end.endObj = new Date();

        data.dt_range.start.startObj.setHours( 0, 0, 0, 0 );
        data.dt_range.end.endObj.setHours(0 , 0, 0, 0 );

        //data.dt_range.end.endObj.setDate( data.dt_range.end.endObj.getDate() + 1 );


        //next day
        var nextDay = {};
        nextDay.dt_range = {};
        nextDay.dt_range.end = {};
        nextDay.dt_range.start = {};
        nextDay.dt_range.start.startObj = new Date();
        nextDay.dt_range.end.endObj = new Date();

        nextDay.dt_range.start.startObj.setDate( nextDay.dt_range.start.startObj.getDate() + 1 );
        nextDay.dt_range.end.endObj.setDate( nextDay.dt_range.end.endObj.getDate() + 8 );

        nextDay.dt_range.start.startObj.setHours( 0, 0, 0, 0 );
        nextDay.dt_range.end.endObj.setHours(0 , 0, 0, 0 );

        

        async.parallel([
            function(cb){

                //get events

                EventModel.getEventsToShow( data, function(err, events){
                    if( err ){
                        cb(err);
                        return false;
                    }

                    cb(null, events);
                });

            },
            function(cb){

                    //get tasks

                    TaskModel.getTasksForEventTable( data, function(err, tasks){
                        if( err ){
                            cb(err);
                            return false;
                        }

                        cb(null, tasks);
                    });

            },
            function(cb){
                //get User birthday

                UserModel.getUserForEventTable(data, function(err, users){
                    if( err ){
                        cb(err);
                        return false;
                    }

                    cb(null, users);
                })
            },

            function(cb){
                //get User birthday on next 7 days

                UserModel.getUserForEventTable(nextDay, function(err, users){
                    if( err ){
                        cb(err);
                        return false;
                    }

                    cb(null, users);
                })
            }
            ], function(err, results){

                var events = results[0];
                var tasks = results[1];
                var users = results[2];
                var usersNextWeek = results[3];

                var htmlTemplate = hbs.compile(template);

                var html = htmlTemplate({
                    events: events,
                    tasks: tasks,
                    users: users,
                    usersNextWeek: usersNextWeek,
                    date: data.dt_range.start.startObj.getDate(),
                    month: data.dt_range.start.startObj.getMonth() + 1,
                    year: data.dt_range.start.startObj.getFullYear()
                });

                var emailAction = new EmailAction({
                    html: html
                });

                emailAction.execute();

        });
        
    }
});

exports.CurrentEvents = CurrentEvents;
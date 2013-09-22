var BaseModel = require('../base/action'),
    EmailAction = require('../email'),
    util = require('util'),
    _ = require('underscore'),
    async = require('async'),
    hbs = require('hbs'),
    template = require('templates/action/cron/currentEvents.hbs'),
    EventModel = require('../../models/event/event');

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

        //data.dt_range.end.endObj.setDate( data.dt_range.end.endObj.getDate() + 1 );

        data.dt_range.start.startObj.setHours( 0, 0, 0, 0 );
        data.dt_range.end.endObj.setHours(0 , 0, 0, 0 );

        async.waterfall([
            function(callback){
                EventModel.getEventsToShow( data, function(err, events){
                    callback(null, events);
                });
            },
            function(events, callback){

                var htmlTemplate = hbs.compile(template);
                var html = htmlTemplate({
                    events: events,
                    date: data.dt_range.start.startObj.getDate(),
                    month: data.dt_range.start.startObj.getMonth() + 1,
                    year: data.dt_range.start.startObj.getFullYear()
                });

                var emailAction = new EmailAction({
                    body: html
                });

                emailAction.execute();
            }
        ], function (err, result) {
            throw new Error(err);
        });
    }
});

exports.CurrentEvents = CurrentEvents;
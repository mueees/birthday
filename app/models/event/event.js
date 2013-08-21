var _ = require('underscore'),
    BaseModel = require('../_base/model'),
    util = require('util'),
    moment = require('moment');

function Event(data){
    this.data = data;
}
util.inherits(Event, BaseModel);

_.extend(Event, BaseModel, {

    get: function(id, cb){

        var _this = this;

        this.connection(function(err, db){
            if( err ){
                cb(err);
            }else{
                _this._get(id, db, cb);
            }
        })
    },
    _get: function(id, db, cb){

        try{
            var idObj = new this.ObjectID(id);
        }catch(e){
            cb({
                errors: "Wrong user id"
            })
            return false;
        }

        db.collection('event').find({
            "_id": idObj
        }).toArray(function(err, result){
                if( err ){
                    cb(err);
                }else{

                    if(!result.length){
                        cb({
                            errors: "Can't find user with same id"
                        });
                    }else{
                        var event = new Event( result[0] );
                        cb(null, event);
                    }


                }
            })
    },

    getEventsToShow: function(data, cb){
        var _this = this;

        //получить все ивенты у которых dateStart > data.dt_range.start
        //возможно будут лишние, но выберем с запасом

        this.connection(function(err, db){
            if( err ){
                cb(err)
            }else{
                _this._getEventsToShow(data, db, cb);
            }
        })
    },

    _getEventsToShow: function(data, db, cb){

        var dt_range = data.dt_range;

        var query = {
                $or:[
                    {
                        "dateStart.dateStartObj": {
                            $lte: dt_range.end.endObj
                        },
                        "dateStart.dateStartObj": {
                            $gte: dt_range.start.startObj
                        },
                        'repeat.repeatType' : "no"
                    },
                    {
                        "dateStart.dateStartObj": {
                            $lte: dt_range.end.endObj
                        },
                        'repeat.repeatType' : {
                            $ne: "no"
                        },
                        'repeat.repeatEnds' : '1'
                    },
                    {
                        "dateStart.dateStartObj": {
                            $lte: dt_range.end.endObj
                        },
                        'repeat.repeatType' : {
                            $ne: "no"
                        },
                        'repeat.repeatEnds' : '2',
                        'repeat.dateRepeatEnd.repeatEndsObj': {
                            $gte: dt_range.start.startObj
                        }
                    }
                ]
            },
            _this = this;


        db.collection('event').find(query).toArray( function(err, events){
            if( err ){
                cb(err);
            }else{

                _this._sortEventsToShow( events, data, cb );
            }
        })

    },

    _sortEventsToShow: function( events, data, cb ){

        var _this = this;
        var dt_range = data.dt_range;
        var eventToShow = [];

        var repeatType, events;

        _.each(events, function(event, i){

            repeatType =  event.repeat.repeatType;
            var event = event;

            if( repeatType == 'no' ){
                var events = _this.getEventTypeNo(event, dt_range);

                eventToShow.push( events );
            }else if( repeatType != 'no' ){

                //every day
                if( repeatType == "1" ){
                    events = _this.getEventTypeEveryDay(event, dt_range);
                    eventToShow = _.union(eventToShow, events);

                    // every week
                }else if( repeatType == "2" || repeatType == "3" || repeatType == "4" || repeatType == "5" ){
                    events = _this.getEventTypeEveryWeek(event, dt_range);
                    eventToShow = _.union(eventToShow, events);

                }else if(repeatType == "6"){
                    events = _this.getEventTypeEveryMonth(event, dt_range);
                    eventToShow = _.union(eventToShow, events);

                    //every year
                }else if(repeatType == "7"){
                    events = _this.getEventTypeEveryYear(event, dt_range);
                    eventToShow = _.union(eventToShow, events);
                }

            }

        })


        cb( null, eventToShow );
    },

    getEventTypeEveryWeek: function(event, dt_range){

        var _this = this;
        var repeatEndsObj;
        var result = [];
        var currentDate;

        //we have end of repeat
        if( event.repeat.repeatEnds == '2' ){
            repeatEndsObj = event.repeat.dateRepeatEnd.repeatEndsObj;
        }

        var start = ( event.dateStart.dateStartObj > dt_range.start.startObj ) ? event.dateStart.dateStartObj : dt_range.start.startObj;
        var end = dt_range.end.endObj;
        var d = new Date(start);

        for( d; d <= end; d.setDate(d.getDate() + 1)  ){

            currentDate = new Date(d);

            if( repeatEndsObj && currentDate > repeatEndsObj ) break
            if( _.lastIndexOf( event.repeat.repeatDays, currentDate.getDay() + "") == -1 ) continue;

            var cloneEvent = _.clone(event);
            cloneEvent._idRaw = event._id;
            cloneEvent.dateStart = _this.getDateStart(currentDate);
            cloneEvent.dateStart.start = event.dateStart.start;
            cloneEvent.dateStart.end = event.dateStart.end;

            delete cloneEvent.repeat;
            delete cloneEvent._id;

            result.push(cloneEvent);

        }

        return result;

    },

    getEventTypeEveryYear: function(event, dt_range){
        var _this = this;
        var repeatEndsObj;
        var result = [];
        var currentDate;

        //we have end of repeat
        if( event.repeat.repeatEnds == '2' ){
            repeatEndsObj = event.repeat.dateRepeatEnd.repeatEndsObj;
        }

        var start = ( event.dateStart.dateStartObj > dt_range.start.startObj ) ? event.dateStart.dateStartObj : dt_range.start.startObj;
        var end = dt_range.end.endObj;
        var d = new Date(start);

        for( d; d <= end; d.setDate(d.getDate() + 1)  ){

            currentDate = new Date(d);

            if( repeatEndsObj && currentDate > repeatEndsObj ) break
            if(event.dateStart.day != currentDate.getDate() || event.dateStart.dateStartObj.getMonth() != currentDate.getMonth() ) continue;

            var cloneEvent = _.clone(event);
            cloneEvent._idRaw = event._id;
            cloneEvent.dateStart = _this.getDateStart(currentDate);
            cloneEvent.dateStart.start = event.dateStart.start;
            cloneEvent.dateStart.end = event.dateStart.end;


            delete cloneEvent.repeat;
            delete cloneEvent._id;
            result.push(cloneEvent);

        }

        return result;
    },

    getEventTypeEveryMonth: function(event, dt_range){
        var _this = this;
        var repeatEndsObj;
        var result = [];
        var currentDate;

        //we have end of repeat
        if( event.repeat.repeatEnds == '2' ){
            repeatEndsObj = event.repeat.dateRepeatEnd.repeatEndsObj;
        }

        var start = ( event.dateStart.dateStartObj > dt_range.start.startObj ) ? event.dateStart.dateStartObj : dt_range.start.startObj;
        var end = dt_range.end.endObj;
        var d = new Date(start);

        for( d; d <= end; d.setDate(d.getDate() + 1)  ){

            currentDate = new Date(d);

            if( repeatEndsObj && currentDate > repeatEndsObj ) break
            if(event.dateStart.day != currentDate.getDate()) continue;

            var cloneEvent = _.clone(event);
            cloneEvent._idRaw = event._id;
            cloneEvent.dateStart = _this.getDateStart(currentDate);
            cloneEvent.dateStart.start = event.dateStart.start;
            cloneEvent.dateStart.end = event.dateStart.end;

            delete cloneEvent.repeat;
            delete cloneEvent._id;
            result.push(cloneEvent);

        }

        return result;
    },

    getEventTypeEveryDay: function( event, dt_range ){
        var _this = this;
        var repeatEndsObj;
        var result = [];

        //we have end of repeat
        if( event.repeat.repeatEnds == '2' ){
            repeatEndsObj = event.repeat.dateRepeatEnd.repeatEndsObj;
        }


        var start = ( event.dateStart.dateStartObj > dt_range.start.startObj ) ? event.dateStart.dateStartObj : dt_range.start.startObj;
        var end = dt_range.end.endObj;
        var d = new Date(start);

        for( d; d <= end; d.setDate(d.getDate() + 1)  ){

            var currentDate = new Date(d);

            if( repeatEndsObj && currentDate > repeatEndsObj ) break;

            var cloneEvent = _.clone(event);
            cloneEvent._idRaw = event._id;
            cloneEvent.dateStart = _this.getDateStart(currentDate);
            cloneEvent.dateStart.start = event.dateStart.start;
            cloneEvent.dateStart.end = event.dateStart.end;

            delete cloneEvent.repeat;
            delete cloneEvent._id;
            result.push(cloneEvent);
        }

        return result;
    },

    getEventTypeNo: function( event, dt_range ){
        event._idRaw = event._id;

        delete event.repeat;
        delete event._id;
        return event;
    },

    getDateStart: function( date ){
        return {
            year: date.getFullYear(),
            month: date.getMonth(),
            day: date.getDate(),
            dateStartObj: new Date( date.getFullYear(), date.getMonth(), date.getDate() )
        }
    }

});

_.extend(Event.prototype, {

    validate: function( data ){
        return true;
    },

    save: function( cb ){

        var _this = this;

        this.connection(function(err, db){

            if( err ){
                cb(err);
            }else{
                _this._save(db,cb);
            }
        })

    },

    _save: function(db, cb){

        var _this = this;

        db.collection('event').insert(_this.data, function(err, result){

            if( err ){
                cb(err);
            }else{
                cb(null, result);
            }
        })
    },

    update: function(cb){
        var _this = this;
        this.connection(function(err, db){
            if( err ){
                cb(err);
            }else{
                _this._update( db,cb );
            }
        })
    },

    _update: function( db,cb ){

        var _this = this;

        try{
            var idObj = new this.ObjectID( _this.data._id );
        }catch(e){
            cb({
                errors: "Wrong event id"
            })
            return false;
        }


        var dataToSave = _this.data;
        delete dataToSave._id;



        db.collection('event').update({
            '_id': idObj
        }, {
            $set: dataToSave
        }, function(err, result){

            if( err ){
                cb(err);
            }else{
                cb(null, result);
            }
        })
    }

})



module.exports = Event;
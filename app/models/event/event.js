var _ = require('underscore'),
    BaseModel = require('../_base/model'),
    util = require('util');

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

                _this._sortEventsToShow( events, cb );
            }
        })

    },

    _sortEventsToShow: function( events, cb ){
        cb( null, events );
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
    }

})



module.exports = Event;
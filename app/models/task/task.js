var _ = require('underscore'),
    BaseModel = require('../_base/model'),
    util = require('util');

function Task(data){
    this.data = data;
}

util.inherits(Task, BaseModel);

_.extend(Task, BaseModel, {

    getTasksForEventTable: function( dt_range, cb ){
        var _this = this;

        this.connection(function(err, db){
            if( err ){
                cb(err);
            }else{
                _this._getTasksForEventTable(dt_range, cb);
            }
        })
    },

    _getTasksForEventTable: function(){
        var query = {
            date: {
                $exist: true
            },
            date: {
                $lte: dt_range.end.endObj,
                $gte: dt_range.start.startObj
            }
        }

        db.collection('tasks').find(query).toArray( function(err, tasks){
            if(err){
                cb(err);
            }else{
                cb(null, tasks);
            }
        })
    },

    getTasks: function( id, cb ){

        var _this = this;

        this.connection(function(err, db){
            if( err ){
                cb(err);
            }else{
                _this._getTasks(id, db, cb);
            }
        })
    },
    _getTasks: function(id, db, cb){
        var query = {
            listId: id
        }

        db.collection('tasks').find(query).toArray( function(err, result){
            if(err){
                cb(err)
            }else{
                cb(null, result)
            }
        })
    },

    deleteTask: function(id, cb){
        var _this = this;
        this.connection(function(err, db){
            if( err ){
                cb(err);
            }else{
                _this._deleteTask(id, db, cb);
            }
        })
    },
    _deleteTask: function(id, db, cb){
        try{
            var idObj = new this.ObjectID(id);
        }catch(e){
            cb({
                errors: "Wrong event id"
            })
            return false;
        }

        db.collection('tasks').remove({
            "_id": idObj
        }, function(err, result){

            if( err ){
                cb(err);
            }else{
                cb(null, result);
            }
        })
    },

    deleteTaskFromList: function(id){
        var _this = this;
        this.connection(function(err, db){
            if( err ){
                cb(err);
            }else{
                _this._deleteTaskFromList(id, db);
            }
        })
    },
    _deleteTaskFromList: function(id, db){
        db.collection('tasks').remove({
            "listId": id
        }, function(err, result){
            console.log("WTF!");
        })
    }
});


_.extend(Task.prototype, {
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

        db.collection('tasks').insert(_this.data, function(err, result){

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

        db.collection('tasks').update({
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

module.exports = Task;
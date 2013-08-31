var _ = require('underscore'),
    BaseModel = require('../_base/model'),
    util = require('util');

function TaskList(data){
    this.data = data;
}

util.inherits(TaskList, BaseModel);

_.extend(TaskList, BaseModel, {
    getTaskLists: function(cb){
        var _this = this;

        this.connection(function(err, db){
            if( err ){
                cb(err)
            }else{
                _this._getTaskLists(db, cb);
            }
        })
    },
    _getTaskLists: function(db, cb){
        var query = {};
        db.collection('taskList').find(query).toArray( function(err, lists){
            if( err ){
                cb(err);
            }else{
                cb(null, lists);
            }
        })
    },

    deleteTaskList: function(id, cb){
        var _this = this;
        this.connection(function(err, db){
            if( err ){
                cb(err);
            }else{
                _this._deleteTaskList(id, db, cb);
            }
        })
    },
    _deleteTaskList: function(id, db, cb){
        try{
            var idObj = new this.ObjectID(id);
        }catch(e){
            cb({
                errors: "Wrong event id"
            })
            return false;
        }

        db.collection('taskList').remove({
            "_id": idObj
        }, function(err, result){

            if( err ){
                cb(err);
            }else{
                cb(null, result);
            }
        })
    }
});

_.extend(TaskList.prototype, {
    save: function(cb){

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

        db.collection('taskList').insert(_this.data, function(err, result){

            if( err ){
                cb(err);
            }else{
                cb(null, result);
            }
        })
    }
})



module.exports = TaskList;
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
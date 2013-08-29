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

})



module.exports = TaskList;
var _ = require('underscore'),
    BaseModel = require('../_base/model'),
    util = require('util');

function Task(data){
    this.data = data;
}

util.inherits(Task, BaseModel);

_.extend(Task, BaseModel, {
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
        };

        db.collection('tasks').find(query).toArray( function(err, result){
            if(err){
                cb(err)
            }else{
                cb(null, result)
            }
        })
    }
});


_.extend(Task.prototype, {

})

module.exports = Task;
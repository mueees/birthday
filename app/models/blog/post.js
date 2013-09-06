var _ = require('underscore'),
    BaseModel = require('../_base/model'),
    util = require('util'),
    moment = require('moment');

function Post(data){
    this.data = data;
}

util.inherits(Post, BaseModel);

_.extend(Post.prototype, {

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

        db.collection('posts').insert(_this.data, function(err, result){

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
                errors: "Wrong post id"
            })
            return false;
        }

        var dataToSave = _this.data;
        delete dataToSave._id;


        db.collection('posts').update({
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

module.exports = Post;
var _ = require('underscore'),
    BaseModel = require('../_base/model'),
    util = require('util');

function User(data){
    this.data = data;
}
util.inherits(User, BaseModel);

_.extend(User, BaseModel, {
    deleteUser: function(id, cb){
        var _this = this;
        this.connection(function(err, db){
            if( err ){
                cb(err);
            }else{
                _this._deleteUser(id, db, cb);
            }
        })
    },
    _deleteUser: function(id, db, cb){
        var _this = this;

        try{
            var idObj = new this.ObjectID(id);
        }catch(e){
            cb({
                errors: "Wrong user id"
            })
            return false;
        }

        db.collection('user').remove({
            "_id": idObj
        }, function(err, result){

            if( err ){
                cb(err);
            }else{
                cb(null, result);
            }
        })
    },

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

        db.collection('user').find({
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
                        var user = new User( result[0] );
                        cb(null, user);
                    }


                }
            })
    },

    getUsers: function(data, cb){
        var _this = this;

        this.connection(function(err, db){
            if( err ){
                cb(err);
            }else{
                _this._getUsers(data, db, cb);
            }
        })
    },

    _getUsers: function( data, db, cb ){
        var _this = this;

        var query = {};

        if( data.month ){
            query['dateBirthday.month'] = {
                $in: data.month
            }
        }

        if( data.year ){
            query['dateBirthday.year'] = {
                $in: data.year
            }
        }
        debugger


        db.collection('user').find(query).toArray( function(err, result){

            if(err){
                cb(err)
            }else{
                cb(null, result)
            }
        })

        

    }
});

_.extend(User.prototype, {

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

        db.collection('user').insert(_this.data, function(err, result){

            if( err ){
                cb(err);
            }else{
                cb(null, result);
            }
        })
    }

})



module.exports = User;
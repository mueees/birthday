var _ = require('underscore'),
    BaseModel = require('../_base/model'),
    util = require('util'),
    moment = require('moment');

function Post(data){
    this.data = data;
}

util.inherits(Post, BaseModel);


_.extend(Post, BaseModel, {
    getPosts: function( userState, cb ){

        var _this = this;

        this.connection(function(err, db){
            if( err ){
                cb(err);
            }else{
                _this._getPosts(userState, db, cb);
            }
        })
    },
    _getPosts: function(userState, db, cb){
        var query;

        if( userState ){
            query = {};
        }else{
            query = {
                $or: [ 
                    {
                        privateType: {
                            $exists: false
                        }
                    },
                        {
                            privateType: "public"
                        }
                    ]
            }
        }

        db.collection('posts').find(query).toArray( function(err, result){
            if(err){
                cb(err)
            }else{
                cb(null, result)
            }
        })
    },

    deletePost: function(id, cb){
        var _this = this;
        this.connection(function(err, db){
            if( err ){
                cb(err);
            }else{
                _this._deletePost(id, db, cb);
            }
        })
    },
    _deletePost: function(id, db, cb){
        try{
            var idObj = new this.ObjectID(id);
        }catch(e){
            cb({
                errors: "Wrong event id"
            })
            return false;
        }

        db.collection('posts').remove({
            "_id": idObj
        }, function(err, result){

            if( err ){
                cb(err);
            }else{
                cb(null, result);
            }
        })
    },
});

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
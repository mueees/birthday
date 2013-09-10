var _ = require('underscore'),
    BaseModel = require('../_base/model'),
    util = require('util'),
    moment = require('moment');

function Preset(data){
    this.data = data;
}

util.inherits(Preset, BaseModel);

_.extend(Preset.prototype, {

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

        db.collection('preset').insert(_this.data, function(err, result){

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

        db.collection('preset').update({
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

_.extend(Preset, BaseModel, {

    getPresets: function(cb){
        var _this = this;

        this.connection(function(err, db){
            if( err ){
                cb(err)
            }else{
                _this._getPresets(db, cb);
            }
        })
    },

    _getPresets: function(db, cb){
        var query = {};
        db.collection('preset').find(query).toArray( function(err, presets){
            if( err ){
                cb(err);
            }else{

                cb(null, presets)
            }
        })
    }

});

module.exports = Preset;
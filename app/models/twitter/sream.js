var _ = require('underscore'),
    BaseModel = require('../_base/model'),
    util = require('util'),
    mongoose = require('mongoose');

/*function Stream(data){
    this.data = data;
}
util.inherits(Stream, BaseModel);
 */


var streamSchema = new Schema({
        name: String,
        text: String,
        people: String,
        language: []
    });
var StreamModel = mongoose.model('Stream', streamSchema);


/*_.extend(Stream, BaseModel, {
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

 db.collection('user').find(query).toArray( function(err, result){
 if(err){
 cb(err)
 }else{
 cb(null, result)
 }
 })



 },

 getCount: function( cb ){

 var _this = this;

 this.connection(function(err, db){
 if( err ){
 cb(err)
 }else{
 _this._getCount( db, cb);
 }
 })

 },
 _getCount: function( db, cb){

 db.collection('user').count(function(err, count){
 if( err ){
 cb(err);
 }else{
 console.log(count);
 cb(null, count);
 }
 })

 }
 });*/

/*_.extend(Stream.prototype, {

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
    },

    update: function( cb ){
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
                errors: "Wrong user id"
            })
            return false;
        }


        var dataToSave = _this.data;
        delete dataToSave._id;

        db.collection('user').update({
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

})*/



module.exports = StreamModel;
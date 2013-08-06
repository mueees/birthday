var MongoClient = require('mongodb').MongoClient;

var db_singleton = null;

var getConnection= function getConnection(callback){
    if (db_singleton){
        callback(null,db_singleton);
    }
    else{

        var connURL = "mongodb://localhost:27017/test";
        MongoClient.connect(connURL,function(err,db){

            if(err){
                log("Error creating new connection "+err);
            }else{
                db_singleton = db;
            }
            callback(err, db_singleton);
            return;
        });
    }
}

module.exports = getConnection;
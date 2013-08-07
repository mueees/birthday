var config = require('../config');

var MongoClient = require('mongodb').MongoClient;
var db_singleton = null;

var getConnection= function getConnection(callback){
    if (db_singleton){
        callback(null,db_singleton);
    }
    else{

        var connURL = "mongodb://"+ config.database.dbIp +":" + config.database.dbPort + "/" + config.database.dbName;
        
        MongoClient.connect(connURL,function(err,db){

            if(err){
                console.log("Error creating new connection "+err);
            }else{
                db_singleton = db;
            }
            
            callback(err, db_singleton);
            return;
        });
    }
}

//getConnection(function(){})

module.exports = getConnection;

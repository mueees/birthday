var MongoClient = require('mongodb').MongoClient;
var Server = require('mongodb').Server;
var mongoclient = new MongoClient(new Server("zba2.kologlobal.local", 27017, {native_parser: true}));

console.log(mongoclient);
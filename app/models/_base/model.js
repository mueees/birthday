var _ = require('underscore');
var mongodb = require('mongodb');
var connection = require("../../db");

function Model(){}

_.extend(Model.prototype, {
	connection: connection,
    ObjectID: mongodb.ObjectID
})

_.extend(Model, {
    connection: connection,
    ObjectID: mongodb.ObjectID
})

module.exports = Model;
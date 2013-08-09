var _ = require('underscore');
var mongodb = require('mongodb');
var connection = require("../../db");

function Model(){}

_.extend(Model.prototype, {
	connection: connection
})

_.extend(Model, {
    connection: connection,
    ObjectID: mongodb.ObjectID
})

module.exports = Model;
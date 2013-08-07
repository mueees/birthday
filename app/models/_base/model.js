var _ = require('underscore');
var connection = require("../../db");

function Model(){}

_.extend(Model.prototype, {
	connection: connection
})

module.exports = Model;
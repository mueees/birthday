var _ = require('underscore');
var db = require("../../db");

function Model(){
    this.db = db;
}

module.exports = Model;
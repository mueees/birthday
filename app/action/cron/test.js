var BaseModel = require('../base/action'),
    util = require('util'),
    _ = require('underscore');

function TestAction(){}
util.inherits(TestAction, BaseModel);

_.extend(TestAction.prototype, {
    execute: function(){

    }
});

exports.test = TestAction;
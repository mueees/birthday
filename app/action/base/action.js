var _ = require('underscore');

function Action(){}

_.extend(Action.prototype, {
    execute: function(){
        throw new Error("You should revrite  execute method");
    }
})

module.exports = Action;
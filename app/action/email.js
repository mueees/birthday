var BaseModel = require('./base/action'),
    util = require('util'),
    EmailSender = require("EmailSender"),
    config = require("config"),

    _ = require('underscore');

function EmailAction(data){

    if( !data.body )  {
        throw new Error("Body should be!")
    }

    var defaultOption = {
        to: config.get("email:list").join(',')
    }
    this.data = _.extend( defaultOption , data);
}

util.inherits(EmailAction, BaseModel);

_.extend(EmailAction.prototype, {

    execute: function(){
        var emailSender = new EmailSender( this.data );
        emailSender.send();
    }
});

module.exports = EmailAction;
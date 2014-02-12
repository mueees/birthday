var ClientModel = require('models/auth/client');
var MemberModel = require('models/member/member');
var logger = require("libs/log")(module);
var mongoose = require("mongoose");
config = require("config");
require("mongooseDb");

/* delete all clients and save one client for "Save selected text for Chrome extension"  */
ClientModel.remove({}, function(err) {
    if( err ){
        logger.info("Cannot remove all Clients from db");
        return false;
    }

    var client = new ClientModel({ name: "Save selected text from browser extension", clientId: "hTr5JEHDWqwFQdBkZd5HP", clientSecret:"89fbz83cGdQPtdny4376ZgfnWgvbBLS6gT5C5Q6T" });
    logger.info("All client was deleted");
    client.save(function(err, client) {
        if(err) return log.error(err);
        logger.info("New client created: clientId - " + client.clientId + " clientSecret - " + client.clientSecret);
    });
});

/* delete all members and save one user with group admin  */
MemberModel.remove({}, function(err) {
    if( err ){
        logger.info("Cannot remove all Member from db");
        return false;
    }
    logger.info("All members was deleted");

    var member = new MemberModel({ name: "mue", password: config.get("password"), group:"admin" });
    member.save(function(err, member) {
        if(err) {
            logger.info("Cannot save mue member");
            return log.error(err);
        }

        logger.info("New member created: name - " + member.name + " member Password - " + member.password + " member group - " + member.group);
    });
});
var ClientModel = require('models/auth/client');
var logger = require("libs/log")(module);
var mongoose = require("mongoose");
require("mongooseDb");

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


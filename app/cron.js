var cronJob = require('cron').CronJob;
var actions = require('./action/cron/currentEvents');


new cronJob('00 00 23 * * 1-5', function(){
    var currentEvents = new actions.CurrentEvents();
    currentEvents.execute();
}, null, true, "America/Los_Angeles");


var cronJob = require('cron').CronJob;
var BackupDb = require('action/cron/backupDb').BackupDb;
var CurrentEvents = require('action/cron/currentEvents').CurrentEvents;

var backupDb = new BackupDb();
backupDb.execute();

new cronJob('00 00 11,19 * * *', function(){
    var backupDb = new BackupDb();
    backupDb.execute();
}, null, true, "Europe/Kiev");


new cronJob('00 00 08-10,17-19,23 * * *', function(){
    var currentEvents = new CurrentEvents();
    currentEvents.execute();
}, null, true, "Europe/Kiev");
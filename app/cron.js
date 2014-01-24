var cronJob = require('cron').CronJob;
var BackupDb = require('action/cron/backupDb').BackupDb;
var CurrentEvents = require('action/cron/currentEvents').CurrentEvents;

var backupDb = new BackupDb();
backupDb.execute();

new cronJob('00 11,19 * * *', function(){
    var backupDb = new BackupDb();
    backupDb.execute();
}, null, true, "Europe/Kiev");


/*The time and date fields are:

    field          allowed values
-----          --------------
minute         0-59*055
hour           0-23
day of month   0-31
month          0-12 (or names, see below)
day of week    0-7 (0 or 7 is Sun, or use names)*/

new cronJob('0,30 * * * *', function(){
    var currentEvents = new CurrentEvents();
    currentEvents.execute();
    console.log('currentEvents cron task execute');
}, null, true, "Europe/Kiev");
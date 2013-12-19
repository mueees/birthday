var cronJob = require('cron').CronJob;
var BackupDb = require('action/cron/backupDb').BackupDb;

var backupDb = new BackupDb();
backupDb.execute();

new cronJob('00 00 11,19 * * *', function(){
    var backupDb = new BackupDb();
    backupDb.execute();
}, null, true, "Europe/Kiev");
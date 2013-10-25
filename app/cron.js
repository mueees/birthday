var cronJob = require('cron').CronJob;
var BackupDb = require('action/cron/backupDb').BackupDb;

new cronJob('00 30 * * * *', function(){
    console.log('backup database');

    var backupDb = new BackupDb();
    backupDb.execute();
}, null, true, "Europe/Kiev");
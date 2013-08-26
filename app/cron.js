var cronJob = require('cron').CronJob;
new cronJob('1 * * * * *', function(){
    console.log('You will see this message every 5 second');
}, null, true, "America/Los_Angeles");
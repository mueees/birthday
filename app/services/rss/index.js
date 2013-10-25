//создать manager, который будет добавлять фиды для обновления в redis
var UpdateFeedWorker = require('./updateFeedWorker');
var updateFeedWorker = new UpdateFeedWorker();

//start services
updateFeedWorker.start();
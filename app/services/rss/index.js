require("mongooseDb");

//manager, добавляет фиды для обновления в redis
var updateFeedWorker = require('./updateFeedWorker');

//manager, мониторит очередь и воркеров
//раздает задания
var updateQueueManager = require('./updateQueueManager');

//start services
//updateFeedWorker.init();
updateQueueManager.init();
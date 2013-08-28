require([
	'app/app',

    /*sub application*/
	'app/user/user_app',
	'app/event/event_app',
	'app/task/task_app',

	/*modules*/
	'app/modules/cache/cache_app',

    /*entities*/
	'app/entities/user',
	'app/entities/event',

	], function(App){
    App.start();
})
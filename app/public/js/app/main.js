require([
	'app/app',

    /*entities*/
    'app/entities/user',
    'app/entities/event',
    'app/entities/task',
    'app/entities/preset',
    'app/entities/blog',

    /*sub application*/
	'app/user/user_app',
	'app/event/event_app',
	'app/task/task_app',
	'app/blog/blog_app',
	'app/timeline/timeline_app',

	/*modules*/
	'app/modules/cache/cache_app'



	], function(App){
    App.start();
})
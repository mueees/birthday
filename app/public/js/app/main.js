require([
	'app/app',

    /*sub application*/
	'app/user/user_app',
	'app/event/event_app',
	'app/task/task_app',
	'app/blog/blog_app',

	/*modules*/
	'app/modules/cache/cache_app',

    /*entities*/
	'app/entities/user',
	'app/entities/event',
	'app/entities/task',
	'app/entities/blog'

	], function(App){
    App.start();
})
require([

    'app/app',

    /*extend*/
    'routefilter',

    /*entities*/
    'app/entities/user',
    'app/entities/event',
    'app/entities/task',
    'app/entities/preset',
    'app/entities/blog',
    'app/entities/login',
    'app/modules/twitter/entities/twitter',

    /*sub application*/
	'app/user/user_app',
	'app/event/event_app',
	'app/task/task_app',
	'app/blog/blog_app',
	'app/fileBrowser/fileBrowser_app',
	'app/timeline/timeline_app',
	'app/login/login_app',
	'app/menu/menu_app',
	'app/home/home_app',
	'app/modules/twitter/twitter_app',

	/*modules*/
	'app/modules/cache/cache_app'
	], function(App){

    App.start();
})
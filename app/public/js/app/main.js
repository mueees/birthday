require([
	'app/app',
	'app/user/user_app',

	/*modules*/
	'app/modules/cache/cache_app',
	'app/entities/user'

	], function(App){
    App.start();
})
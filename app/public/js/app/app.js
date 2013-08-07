define([
	'backbone',
	'marionette',
	'app/config/global',
	'jquery'

	], function(Backbone, Marionette, globalConfig){
	
	var App = new Marionette.Application();
	
	App.config = globalConfig;

    App.addRegions({
        body: 'body',
        header: '.header',
        main: '.main'
    });

    App.on('initialize:after', function(){
        if( Backbone.history ){
            Backbone.history.start();
        }
    })

	App.startSubApp = function(appName, args){
	    var currentApp = App.module(appName);
	    if (App.currentApp === currentApp){ return; }

	    if (App.currentApp){
	      App.currentApp.stop();
	    }

	    App.currentApp = currentApp;
	    currentApp.start(args);
	};

	return App;

})
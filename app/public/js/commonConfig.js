requirejs.config({

    baseUrl: 'js/libs',

    paths: {
        app: '../app',
        plugins: '../plugins',
        jasmine: 'jasmine/jasmine',
        jasmineHtml: 'jasmine/jasmine-html',
        marionette: 'marionette',

        /*plugins*/
        validate: '../plugins/jquery/jquery.validate',
        datepicker: '../plugins/bootstrap-datepicker'
    },

    shim:{
        jquery: {
            exports: "jQuery"
        },
    	backbone: {
    		deps: ['jquery', 'underscore'],
    		exports: 'Backbone'
    	},
        jasmine: {
            exports: "jasmine"
        },
        jasmineHtml: {
            deps: ['jasmine'],
            exports: "jasmine"
        },
        marionette:{
            deps: ['backbone', 'underscore'],
            exports: "Marionette"
        },

        /*plugins*/
        validate: {
            deps: ['jquery'],
            exports: 'jQuery'
        },
        datepicker: {
            deps: ['jquery']
        }
    },

    urlArgs: "bust=" + (new Date()).getTime()
});
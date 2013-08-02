requirejs.config({

    baseUrl: 'js/libs',

    paths: {
        app: '../app',
        jasmine: 'jasmine/jasmine',
        jasmineHtml: 'jasmine/jasmine-html',
        marionette: 'marionette'
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
        }
    }
});
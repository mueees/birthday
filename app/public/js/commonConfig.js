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
        datepicker: '../plugins/bootstrap-datepicker',
        datepickerTime: '../plugins/bootstrap-datetimepicker',
        timepicker: '../plugins/bootstrap-timepicker',
        moment: '../plugins/moment',

        /*libs*/
        bootstrap: "bootstrap/bootstrap"
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

        /*libs*/
        bootstrap: {
            deps: ['jquery']
        },

        /*plugins*/

        validate: {
            deps: ['jquery'],
            exports: 'jQuery'
        },
        datepicker: {
            deps: ['jquery']
        },
        datepickerTime: {
            deps: ['jquery']
        },
        timepicker: {
            deps: ['jquery', 'bootstrap']
        }
    },

    urlArgs: "bust=" + (new Date()).getTime()
});
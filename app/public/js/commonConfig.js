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
        ckeditor: 'ckeditor/ckeditor',

        /*libs*/
        bootstrap: "bootstrap/bootstrap",
        routefilter: "backbone.routefilter",
        async: "async"
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
        ckeditor: {
            exports: 'CKEDITOR'
        },
        routefilter: {
            deps: ['backbone']
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
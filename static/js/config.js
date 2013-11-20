requirejs.config({
    // Karma serves files from '/base'
    baseUrl: './',

    paths: {
        'lib': 'tests/lib',
        'tpl': 'static/tpl',
        'app': 'static/js/app',
        'vendor': 'tests/lib/vendor',
        'jasmine': 'tests/lib/jasmine',
        'spec': 'tests/spec',
        'built': 'built',
        'jquery': 'tests/lib/vendor/jquery',

    },

    map: {
        '*': {
            'underscore'        : 'vendor/lodash',
            'backbone'          : 'vendor/backbone',
            'marionette'        : 'vendor/marionette',
            'stickit'           : 'vendor/stickit',
            'Handlebars'        : 'vendor/handlebars',
            'hbs'               : 'vendor/hbs',
            'i18nprecompile'    : 'vendor/i18nprecompile',
            'i18n'              : 'vendor/i18n',
            'json2'             : 'vendor/json2',
        }
    },


    shim: {


        // Vendor shims

        'vendor/backbone': {
            'deps': ['jquery', 'underscore'],
            'exports': 'Backbone'
        },

        'vendor/marionette': {
            'deps': ['jquery', 'underscore', 'backbone'],
            'exports': 'Marionette'
        },

        'vendor/stickit': {
            'deps' : ['backbone'],
            'exports' : 'Stickit'
        }
    },

    hbs : {
        templateExtension: "html",
        disableHelpers: false,
        disableI18n: true
    },
});



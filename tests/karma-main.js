var tests = [
    'lib/jasmine/jasmine-jquery',
    // Load mocks and vendor init
    //'tests/mocks/init',
    //'tests/vendor/init',

    // ---------------------------
    // Load Specs (AKA tests)
    'spec/built-calendar',
    'spec/built-control-drag-drop-list',
    'spec/built-control-input-select',
    'spec/built-control-scroller',
    'spec/built-control-slider-horizontal-range',
    'spec/built-control-slider-horizontal',
    'spec/built-datetime-formats',
    'spec/built-datetime',
    'spec/built-gestures-swipe',
    'spec/built-jquery-collection',
    'spec/built-managers-array',
    'spec/built-managers-focus-single',
    'spec/built-managers-focus',
    'spec/built-managers-index',
    'spec/built-managers-key-equivalent',
    'spec/built-managers-range',
    'spec/built-managers-scroll',
    'spec/built-responders-drag',
    'spec/built-responders-drop',
    'spec/built-responders-keys',
    'spec/built-responders-mouse',
    'spec/built-responders-scroll',
    'spec/built-responders-touches',
    'spec/built-responders-window',
    'spec/built-ui-helpers-dom-getElement',
    'spec/built-ui-helpers-dom',
    'spec/built-utils-helpers-registerElement',
    'spec/built-utils-helpers',
    'spec/built-utils-ioc',
    'spec/built-control-select'
];

requirejs.config({
    baseUrl: '/base/tests',

    shim: {
        'lib/jasmine/jasmine-jquery': {
            'deps': ['jquery']
        },
    },

    deps: tests,

    callback: function(){
        jasmine.getFixtures().fixturesPath = '/base/tests/fixtures';
        window.__karma__.start();
    }
});

// var tests = [
//     'spec/built-calendar',
//     'spec/built-control-drag-drop-list',
//     'spec/built-control-input-select',
//     'spec/built-control-scroller',
//     'spec/built-control-slider-horizontal-range',
//     'spec/built-control-slider-horizontal',
//     'spec/built-datetime-formats',
//     'spec/built-datetime',
//     'spec/built-gestures-swipe',
//     'spec/built-jquery-collection',
//     'spec/built-managers-array',
//     'spec/built-managers-focus-single',
//     'spec/built-managers-focus',
//     'spec/built-managers-index',
//     'spec/built-managers-key-equivalent',
//     'spec/built-managers-range',
//     'spec/built-managers-scroll',
//     'spec/built-responders-drag',
//     'spec/built-responders-drop',
//     'spec/built-responders-keys',
//     'spec/built-responders-mouse',
//     'spec/built-responders-scroll',
//     'spec/built-responders-touches',
//     'spec/built-responders-window',
//     'spec/built-ui-helpers-dom-getElement',
//     'spec/built-ui-helpers-dom',
//     'spec/built-utils-helpers-registerElement',
//     'spec/built-utils-helpers',
//     'spec/built-utils-ioc',
//     'spec/built-control-select'
// ];

// var path = '';

// if (typeof window.__karma__ !== 'undefined') {
//   path += '/base/';
// }

// requirejs.config({
//     // Karma serves files from '/base'
//     baseUrl: '/base',

//     paths: {
//         'lib': 'tests/lib',
//         'vendor': 'tests/lib/vendor',
//         'jasmine': 'tests/lib/jasmine',
//         'spec': 'tests/spec',
//         'built': 'built',

//         // Only jquery is allowed to do this as it's a named module
//         // https://github.com/jrburke/requirejs/wiki/Updating-existing-libraries#wiki-anon
//         'jquery': 'tests/lib/vendor/jquery'
//     },

//     map: {
//         '*': {
//             'underscore': 'vendor/lodash',
//             'backbone'  : 'vendor/backbone',
//             'marionette': 'vendor/marionette',
//             'stickit'   : 'vendor/stickit',
//             'handlebars': 'vendor/handlebars'
//         }
//     },


//     shim: {

//         // Jasmine shims

//         'jasmine/jasmine': {
//             'deps': [],
//         },

//         'jasmine/boot': {
//             'deps': ['jasmine/jasmine',
//                      'jasmine/jasmine-html'],
//             'exports': 'jasmine'
//         },

//         'jasmine/jasmine-html': {
//             'deps': ['jasmine/jasmine']
//         },

//         'jasmine/jasmine-jquery': {
//             'deps': [
//             'jasmine/jasmine',
//             'jasmine/boot']
//         },

//         'jasmine/console': {
//             'deps': ['jasmine/jasmine']
//         },

//         // Vendor shims

//         'vendor/backbone': {
//             'deps': ['jquery', 'underscore'],
//             'exports': 'Backbone'
//         },

//         'vendor/marionette': {
//             'deps': ['jquery', 'underscore', 'backbone'],
//             'exports': 'Marionette'
//         },

//         'vendor/stickit': {
//             'deps' : ['backbone'],
//             'exports' : 'Stickit'
//         }
//     },

//     // ask Require.js to load these files (all our tests)
//     deps: tests,

//     // start test run, once Require.js is done
//     callback: function(){
//         require(['jasmine/karma'], function(){
//             // jasmine/boot sets the onload handler
//             // we call it since we know we are ready.
//             //
//             // effectively calls this:
//             // htmlReporter.initialize();
//             // env.execute();
//             //window.onload();

//             window.__karma__.start();
//         });
//     }
// });



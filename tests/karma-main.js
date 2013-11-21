// var tests = [];
// for (var file in window.__karma__.files) {
//   if (window.__karma__.files.hasOwnProperty(file)) {
//     if (/auf.+\.js$/.test(file)) {
//       tests.push(file);
//     }

//     // if (/auf-managers.{0,}\.js$/.test(file)) {
//     //   tests.push(file);
//     // }

//     // if (/auf-calendar.{0,}\.js$/.test(file)) {
//     //   tests.push(file);
//     // }

//     // if (/auf-control-input.{0,}\.js$/.test(file)) {
//     //   tests.push(file);
//     // }

//     // if (/auf-datetime.{0,}\.js$/.test(file)) {
//     //   tests.push(file);
//     // }

//     // if (/auf-gestures.{0,}\.js$/.test(file)) {
//     //   tests.push(file);
//     // }

//     // if (/auf-jquery.{0,}\.js$/.test(file)) {
//     //   tests.push(file);
//     // }

//     // if (/auf-managers.{0,}\.js$/.test(file)) {
//     //   tests.push(file);
//     // }

//     // if (/auf-responders.{0,}\.js$/.test(file)) {
//     //   tests.push(file);
//     // }

//     // if (/auf-control-slider-horizontal\.js$/.test(file)) {
//     //   tests.push(file);
//     // }
//   }
// }

var tests = [
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

];

var path = '';

if (typeof window.__karma__ !== 'undefined') {
  path += '/base/';
}

requirejs.config({
    // Karma serves files from '/base'
    baseUrl: '/base',

    paths: {
        'lib': 'tests/lib',
        'vendor': 'tests/lib/vendor',
        'jasmine': 'tests/lib/jasmine',
        'spec': 'tests/spec',
        'built': 'built',

        // Only jquery is allowed to do this as it's a named module
        // https://github.com/jrburke/requirejs/wiki/Updating-existing-libraries#wiki-anon
        'jquery': 'tests/lib/vendor/jquery'
    },

    map: {
        '*': {
            'underscore': 'vendor/lodash',
            'backbone'  : 'vendor/backbone',
            'marionette': 'vendor/marionette',
            'stickit'   : 'vendor/stickit',
            'handlebars': 'vendor/handlebars'
        }
    },


    shim: {

        'jasmine/jasmine-jquery': {
            //'deps': ['jasmine/jasmine']
        },

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

    // ask Require.js to load these files (all our tests)
    deps: tests,

    // start test run, once Require.js is done
    callback: function(){
        require(['jasmine/karma'], function(){
            window.__karma__.start();
        });
    }
});



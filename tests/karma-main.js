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
  'spec/auf-utils-helpers',
  'spec/auf-jquery-collection',
  'spec/auf-calendar',
  'spec/auf-datetime',
  'spec/auf-datetime-formats',
  'spec/auf-responders-keys',
  'spec/auf-responders-touches',
  'spec/auf-responders-mouse',
  'spec/auf-responders-window',
  'spec/auf-responders-scroll',
  'spec/auf-gestures-swipe',
  'spec/auf-managers-index',
  'spec/auf-managers-focus',
  'spec/auf-managers-focus-single',
  'spec/auf-managers-list',
  'spec/auf-managers-range',
  'spec/auf-managers-scroll',
  'spec/auf-control-slider-horizontal',
  'spec/auf-control-slider-horizontal-range',
  'spec/auf-control-input-select',
  'spec/auf-control-scroller'
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
        'auf': 'agency-ui-foundation',

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



var tests = [];
for (var file in window.__karma__.files) {
  if (window.__karma__.files.hasOwnProperty(file)) {
    if (/auf.+\.js$/.test(file)) {
      tests.push(file);
    }

    // if (/auf-managers.{0,}\.js$/.test(file)) {
    //   tests.push(file);
    // }

    // if (/auf-calendar.{0,}\.js$/.test(file)) {
    //   tests.push(file);
    // }

    // if (/auf-control-input.{0,}\.js$/.test(file)) {
    //   tests.push(file);
    // }

    // if (/auf-datetime.{0,}\.js$/.test(file)) {
    //   tests.push(file);
    // }

    // if (/auf-gestures.{0,}\.js$/.test(file)) {
    //   tests.push(file);
    // }

    // if (/auf-jquery.{0,}\.js$/.test(file)) {
    //   tests.push(file);
    // }

    // if (/auf-managers.{0,}\.js$/.test(file)) {
    //   tests.push(file);
    // }

    // if (/auf-responders.{0,}\.js$/.test(file)) {
    //   tests.push(file);
    // }

    // if (/auf-control-slider-horizontal\.js$/.test(file)) {
    //   tests.push(file);
    // }
  }
}

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
        'auf': 'agency-ui-foundation'
    },

    map: {
        '*': {
            'underscore': 'vendor/underscore',
            'jquery'    : 'vendor/jquery',
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

        'vendor/underscore': {
            'exports': '_'
        },

        'vendor/jquery': {
            'exports': '$'
        },

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



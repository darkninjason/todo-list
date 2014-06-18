require.config({
  baseUrl: './',

  paths : {
    'marionette': 'tests/lib/vendor/backbone/marionette',
    'stickit': 'tests/lib/vendor/backbone/stickit',
  },

   packages: [

        {
            location: '/static/js/app',
            name: 'app'
        },
        {
            location: '/static/tpl',
            name: 'tpl'
        },

        {
            location: 'tests/lib/vendor/jquery',
            name: 'jquery',
            main:'jquery'
        },

        {
            location: 'tests/lib/vendor/backbone',
            name: 'backbone',
            main:'backbone'
        },

        {
            location: 'built',
            name: 'built'
        },

        {
            location: 'tests/lib/vendor/require/hbs',
            name: 'hbs',
            main:'hbs'
        }
    ],

    map: {
        '*': {
            'underscore': 'tests/lib/vendor/underscore/lodash',
            'handlebars': 'hbs/handlebars',
        },
    },

  hbs: {
        templateExtension : 'html',
        // if disableI18n is `true` it won't load locales and the i18n helper
        // won't work as well.
        disableI18n : true,
        helperDirectory: 'app/shared/hbs'
  },

  shim : {

    'backbone': {
        'deps': ['jquery', 'underscore'],
        'exports': 'Backbone'
    },

    'backbone/stickit' : {
      'deps' : ['backbone'],
      'exports' : 'Stickit'
    },

    'jquery/mockjax': {
        'deps': ['jquery'],
        'exports': 'jquery'
    },

    'marionette': {
        'deps': ['jquery', 'underscore', 'backbone'],
        'exports': 'Marionette'
    }
  },

  // introduced in requirejs 2.1.11, helps Backbone along.
  // http://jrburke.com/2014/02/16/requirejs-2.1.11-released/
  wrapShim: true,

});

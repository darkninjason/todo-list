require.config({
  baseUrl: 'static/js',

  paths : {
    'marionette': 'vendor/backbone/marionette',
    'localstorage': 'vendor/backbone/backbone.localStorage'
  },

   packages: [

        {
            location: 'app',
            name: 'app'
        },

        {
            location: 'vendor/jquery',
            name: 'jquery',
            main:'jquery'
        },

        {
            location: 'vendor/backbone',
            name: 'backbone',
            main:'backbone'
        },

        {
            location: 'vendor/built',
            name: 'built'
        },

        {
            location: 'vendor/require/hbs',
            name: 'hbs',
            main:'hbs'
        }
    ],

    map: {
        '*': {
            'underscore': 'vendor/underscore/lodash',
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
  }

});
require.config({
  baseUrl: './',

  paths : {
    'marionette': 'lib/vendor/backbone/marionette',
  },

   packages: [

        {
            location: '../built',
            name: 'built'
        },

        {
            location: 'lib/vendor/jquery',
            name: 'jquery',
            main:'jquery'
        },

        {
            location: 'lib/vendor/backbone',
            name: 'backbone',
            main:'backbone'
        },

        {
            location: 'lib/vendor/require/hbs',
            name: 'hbs',
            main:'hbs'
        }
    ],

    map: {
        '*': {
            'underscore': 'lib/vendor/underscore/lodash',
            'handlebars': 'hbs/handlebars'
        }
    },

  hbs: {
        templateExtension : 'html',
        // if disableI18n is `true` it won't load locales and the i18n helper
        // won't work as well.
        disableI18n : true,
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

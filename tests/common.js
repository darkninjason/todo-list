require.config({
  baseUrl: './',

  paths : {
    'marionette': 'lib/vendor/backbone/marionette',
    'hbs': 'lib/vendor/require/hbs/hbs',

    // used for hbs plugin, name is remapped to
    // lowercase as well for convenience. The optimizer
    // dies, even with the map in place, if we do this
    // any other way.
    //
    // see:
    // https://github.com/SlexAxton/require-handlebars-plugin/issues/144
    'Handlebars': 'lib/vendor/handlebars/handlebars'
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
        }
    ],

    map: {
        '*': {
            'underscore': 'lib/vendor/underscore/lodash',
            'handlebars': 'Handlebars',
        },

        'hbs':{
            'i18nprecompile' : 'lib/vendor/require/hbs/i18nprecompile',
            'json2' : 'lib/vendor/require/hbs/json2',
            'underscore': 'lib/vendor/require/hbs/underscore'
        }
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

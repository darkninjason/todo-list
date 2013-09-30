require.config({

// Config must conform to valid json.

'packages': [
    {
        'name': 'auf',
        'location': 'agency-ui-foundation'
    },
    {
        'name': 'vendor',
        'location': 'agency-ui-foundation/vendor'
    }
],

'shim': {
    'vendor/modernizr': {
        'exports': 'Modernizr'
    },
    'vendor/underscore': {
        'exports': '_'
    },
    'vendor/jquery': {
        'exports': 'jQuery'
    },
    'vendor/backbone': {
        'deps': ['vendor/jquery', 'vendor/underscore'],
        'exports': 'Backbone'
    },
    'vendor/marionette': {
        'deps': ['vendor/jquery', 'vendor/underscore', 'vendor/backbone'],
        'exports': 'Marionette'
    },
    'vendor/stickit': {
        'deps' : ['vendor/backbone'],
        'exports' : 'Stickit'
    }

}

}); // eof require.config

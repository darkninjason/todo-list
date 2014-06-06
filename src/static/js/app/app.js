define(function(require, exports, module) {
    var marionette = require('marionette');
    var app = new marionette.Application();

    app.addRegions({
        header: '#header',
        main: '#main',
        footer: '#footer'
    });

    app.addInitializer(function() {
        Backbone.history.start({
            pushState: true,
            root: '#'
        });
    });


    return app;
});
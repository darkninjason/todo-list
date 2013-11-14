define(function(require, exports, module) {
    var marionette = require('marionette');
    var app = new Backbone.Marionette.Application();

    app.addRegions({
        hRangeSlider:"#horizontal-range-slider"
    });

    return app;
});
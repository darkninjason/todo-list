define(function(require, exports, module) {
    var marionette = require('marionette');
    var app = new Backbone.Marionette.Application();

    app.addRegions({
        hRangeSlider: '#horizontal-range-slider',
        scroller: '#scroller',
        inputSelect: '#input-select',
        inputSelectScrollable: '#input-select-scrollable'
    });

    return app;
});

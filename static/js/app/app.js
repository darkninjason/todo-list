define(function(require, exports, module) {
    var marionette = require('marionette');
    var app = new Backbone.Marionette.Application();

    app.addRegions({
        inputSelect: '#input-select',
        horizontalSliderFluid: '#horizontal-slider-fluid',
        horizontalSliderSnapping: '#horizontal-slider-snapping',
        horizontalRangeSliderFluid: '#horizontal-range-slider-fluid',
        horizontalRangeSliderSnapping: '#horizontal-range-slider-snapping',
        dndTop: '#dnd-top',
        dndMid: '#dnd-mid',
        dndBottom: '#dnd-bottom',
        select: '#select'
    });

    return app;
});

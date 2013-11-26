define(function(require, exports, module) {
    var marionette = require('marionette');
    var app = new Backbone.Marionette.Application();

    app.addRegions({
        scroller: '#scroller',
        inputSelect: '#input-select',
        inputSelectScrollable: '#input-select-scrollable',
        horizontalSliderFluid: '#horizontal-slider-fluid',
        horizontalSliderSnapping: '#horizontal-slider-snapping',
        horizontalRangeSliderFluid: '#horizontal-range-slider-fluid',
        horizontalRangeSliderSnapping: '#horizontal-range-slider-snapping',
        dndTop: '#dnd-top',
        dndMid: '#dnd-mid',
        dndBottom: '#dnd-bottom'
    });

    return app;
});

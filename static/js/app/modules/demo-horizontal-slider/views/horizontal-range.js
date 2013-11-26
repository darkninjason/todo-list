define(function (require, exports, module) {

var marionette = require('marionette');
var drivers = {};

var template = require('hbs!tpl/horizontal-range-slider');
var slider = require('built/ui/views/items/horizontal-range-slider');


var HorizontalRangeSlider = slider.HorizontalRangeSlider.extend({
    template: template,

    onShow: function(){
        this.initializeSliderControl();
        this.setPositionAt(1, 1);
    }
});

exports.HorizontalRangeSlider = HorizontalRangeSlider;
});

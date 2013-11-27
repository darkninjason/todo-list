define(function (require, exports, module) {

var SliderView = require('built/ui/views/items/slider').SliderView;
var HorizontalRangeSliderControl = require('built/core/controls/sliders/horizontal-range').HorizontalRangeSliderControl;

var HorizontalRangeSliderView =  SliderView.extend({

    getDriver: function(options){
        return new HorizontalRangeSliderControl(options);
    }
});

exports.HorizontalRangeSliderView = HorizontalRangeSliderView;

});



define(function (require, exports, module) {
    
var marionette = require('marionette');
var template = require('hbs!tpl/horizontal-range-slider');
var HorizontalRangeSlider = require('auf/ui/controls/sliders/horizontal-range').HorizontalRangeSlider;

var HorizontalRangeSliderView = marionette.ItemView.extend({
    template : template,
    ui : {
        track: '.slider .track',
        handles: '.slider .handle'
    },
    events : {
        
    },
    onShow : function(){
        // TODO: once auby is done, implement his new slider
    }
});

exports.HorizontalRangeSliderView = HorizontalRangeSliderView;

});

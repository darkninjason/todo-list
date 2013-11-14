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
        var horizontalRangeSlider = new HorizontalRangeSlider(
            {
                $track            : this.ui.track,
                $handles          : this.ui.handles,
                steps             : 10,
                snap              : true,
                acceptsMouse      : true,
                acceptsTouch      : false,
                acceptsOrientation: false,
            }
        );
    }
});

exports.HorizontalRangeSliderView = HorizontalRangeSliderView;

});

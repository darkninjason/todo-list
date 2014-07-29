define(function (require, exports, module) {

var template = require('hbs!tpl/horizontal-range-slider');
var HorizontalRangeSliderView = require('built/ui/views/item/horizontal-range-slider').HorizontalRangeSliderView;

var HorizontalRangeSlider = HorizontalRangeSliderView.extend({

    template: template,

    onShow: function(){
        this.initializeSliderContainer();
        this.setPositionAt(1, 1);
    },

    getTrack: function(){
        return this.$('.track');
    },

    getHandles: function(options){
        return this.$('.handle');
    }
});

exports.HorizontalRangeSlider = HorizontalRangeSlider;

});

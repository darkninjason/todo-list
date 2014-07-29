define(function (require, exports, module) {

var template = require('hbs!tpl/horizontal-slider');
var HorizontalSliderView = require('built/ui/views/item/horizontal-slider').HorizontalSliderView;

var HorizontalSlider = HorizontalSliderView.extend({

    template: template,

    onShow: function(){
        this.initializeSliderContainer();
    },

    getTrack: function(){
        return this.$('.track');
    },

    getHandles: function(options){
        return this.$('.handle');
    }
});

exports.HorizontalSlider = HorizontalSlider;

});

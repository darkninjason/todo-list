define(function (require, exports, module) {

var marionette = require('marionette');
var drivers = {};

var template = require('hbs!tpl/horizontal-slider');
var slider = require('built/ui/views/items/horizontal-slider');


var HorizontalSlider = slider.HorizontalSlider.extend({
    template: template,

    onShow: function(){
        this.initializeSliderControl();
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

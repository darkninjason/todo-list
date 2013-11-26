define(function (require, exports, module) {

var marionette = require('marionette');
var HorizontalSliderBase = require('./horizontal-slider-base').HorizontalSliderBase;
var driver = require('built/core/controls/sliders/horizontal');

var HorizontalSlider =  HorizontalSliderBase.extend({

    getDriver: function(options){

        return new driver.HorizontalSlider({
            $container: options.$container,
            $track: options.$track,
            $handles: options.$handles,
            steps: options.steps,
            snap: options.snap,
            acceptsMouse: true,
            acceptsTouch: true,
            acceptsOrientation: true

        });
    }
});


exports.HorizontalSlider = HorizontalSlider;

});



define(function (require, exports, module) {

var marionette = require('marionette');
var HorizontalSliderBase = require('./horizontal-slider-base').HorizontalSliderBase;
var driver = require('built/core/controls/sliders/horizontal-range');

var HorizontalRangeSlider =  HorizontalSliderBase.extend({

    getDriver: function(options){

        return new driver.HorizontalRangeSlider({
            $container: options.$container,
            $track: options.$track,
            $handles: options.$handles,
            steps: options.steps,
            snap: options.snap,
            acceptsMouse: true,
            acceptsTouch: true,
            acceptsOrientation: true

        });
    },

    setPositionAt: function(value, index) {
        this.slider._driver.setPositionAt(value, index);
    },

    getPositionAt: function(index) {
        return this.slider._driver.getPositionAt(index);
    },

    getPositions: function() {
        return this.slider._driver.getPositions(value);
    },

    setStepAt: function(value, index) {
        this.slider._driver.setStepAt(value, index);
    },

    getStepAt: function(index) {
        return this.slider._driver.getStepAt(index);
    },

    getSteps: function() {
        return this.slider._driver.getSteps();
    }

});


exports.HorizontalRangeSlider = HorizontalRangeSlider;

});



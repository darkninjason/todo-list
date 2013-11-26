define(function (require, exports, module) {

var marionette = require('marionette');
var drivers = {};

var slider = require('built/ui/views/items/horizontal-slider');
var template = require('hbs!tpl/horizontal-slider');

drivers.HorizontalSlider = require('built/core/controls/sliders/horizontal').HorizontalSlider;
drivers.HorizontalRangeSlider = require('built/core/controls/sliders/horizontal-range').HorizontalRangeSlider;


var FluidSlider =  slider.HorizontalSliderBase.extend({

    getDriver: function(options){

        return new drivers.HorizontalSlider({
            $container: options.$container,
            $track: options.$track,
            $handles: options.$handles,
            acceptsMouse: true,
            acceptsTouch: true,
            acceptsOrientation: true
        });
    }
});

var FluidRangeSlider =  slider.HorizontalSliderBase.extend({

    getDriver: function(options){

        return new drivers.HorizontalRangeSlider({
            $container: options.$container,
            $track: options.$track,
            $handles: options.$handles,
            acceptsMouse: true,
            acceptsTouch: true,
            acceptsOrientation: true
        });
    }
});


var SnappingSlider =  slider.HorizontalSliderBase.extend({

    initialize: function(options){
        this.steps = options.steps;
    },

    getDriver: function(options){

        return new drivers.HorizontalSlider({
            $container: options.$container,
            $track: options.$track,
            $handles: options.$handles,
            steps: 10,
            snap: true,
            acceptsMouse: true,
            acceptsTouch: true,
            acceptsOrientation: true
        });
    }
});

var SnappingRangeSlider =  slider.HorizontalSliderBase.extend({

    initialize: function(options){
        this.steps = options.steps;
    },

    getDriver: function(options){

        return new drivers.HorizontalRangeSlider({
            $container: options.$container,
            $track: options.$track,
            $handles: options.$handles,
            steps: 10,
            snap: true,
            acceptsMouse: true,
            acceptsTouch: true,
            acceptsOrientation: true
        });
    }
});

var HorizontalSlider =  slider.HorizontalSliderBase.extend({
    template: template,

    onShow: function(){
        var $fluid = this.$('#fluid');
        var $fluidRange = this.$('#fluid-range');
        var $snapping = this.$('#snapping');
        var $snappingRange = this.$('#snapping-range');

        var fluid = new FluidSlider({
            el: $fluid
        });

        var fluidRange = new FluidRangeSlider({
            el: $fluidRange
        });

        var snapping = new SnappingSlider({
            el: $snapping,
            staps: 10
        });

        var snappingRange = new SnappingRangeSlider({
            el: $snappingRange,
            staps: 10
        });

        fluid.initializeSliderControl();

        fluidRange.initializeSliderControl();
        fluidRange.slider._driver.setPositionAt(1, 1);

        snapping.initializeSliderControl();

        snappingRange.initializeSliderControl();
        snappingRange.slider._driver.setPositionAt(1, 1);
    }
});

exports.HorizontalSlider = HorizontalSlider;

});

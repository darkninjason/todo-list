define(function (require, exports, module) {

var marionette = require('marionette');

var slider = require('built/ui/views/items/horizontal-slider');
var drivers = require('built/core/controls/sliders/horizontal');
var template = require('hbs!tpl/horizontal-slider');



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

var HorizontalSlider =  slider.HorizontalSliderBase.extend({
    template: template,

    onShow: function(){
        var $fluid = this.$('#fluid');
        var $snapping = this.$('#snapping');

        var fluid = new FluidSlider({
            el: $fluid
        });

        var snapping = new SnappingSlider({
            el: $snapping,
            staps: 10
        });

        fluid.initializeSliderControl();
        snapping.initializeSliderControl();
    }
});

exports.HorizontalSlider = HorizontalSlider;

});

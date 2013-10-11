define(function(require, exports, module) {

// Imports

var Marionette       = require('marionette');
var _                = require('underscore');
var HorizontalSlider = require('auf/ui/controls/sliders/horizontal');

// Module

// TODO
// - Explore - See what using BB's extend on HorizontalSlider looks like.

var HorizontalRangeSlider =  Marionette.Controller.extend({

    // Properties

    slider: null,

    // Backbone & Marionette overrides

    /**
     * Initialize HorizontalRangeSlider
     *
     * @description HorizontalRangeSlider simply composes a HorizontalSlider
     * performing some overrides of internal HorizontalSlider methods to
     * enforce additional constraints on slider handles.
     *
     * @param  {object} options options literal
     * @return {undefined}
     *
     * @example
     * horizontalRangeSlider = new HorizontalRangeSlider(
     *     {
     *         $track            : $('.slider .track'),    // required
     *         $handles          : $('.slider .handle'),   // min 2 required
     *         steps             : 10,                     // default 0
     *         snap              : true,                   // default false
     *         acceptsMouse      : true                    // default true
     *         acceptsTouch      : false                   // default false
     *         acceptsOrientation: false                   // default false
     *     }
     * );
     */
    initialize: function(options) {
        this.slider = new HorizontalSlider(options);

        // grab event contstants
        this.EVENT_CHANGE     = this.slider.EVENT_CHANGE;
        this.EVENT_DRAG_START = this.slider.EVENT_DRAG_START;
        this.EVENT_DRAG_STOP  = this.slider.EVENT_DRAG_STOP;

        // horizontal slider public api forwrading
        // set local proxy, but re-bind scope to original scope.
        this.getPositionAt        = _.bind(this.slider.getPositionAt,        this.slider);
        this.getPositions         = _.bind(this.slider.getPositions,         this.slider);
        this.getPositionForHandle = _.bind(this.slider.getPositionForHandle, this.slider);
        this.setPositionAt        = _.bind(this.slider.setPositionAt,        this.slider);
        this.setPositionForHandle = _.bind(this.slider.setPositionForHandle, this.slider);
        this.getStepAt            = _.bind(this.slider.getStepAt,            this.slider);
        this.getSteps             = _.bind(this.slider.getSteps,             this.slider);
        this.getStepForHandle     = _.bind(this.slider.getStepForHandle,     this.slider);
        this.setStepAt            = _.bind(this.slider.setStepAt,            this.slider);
        this.setStepForHandle     = _.bind(this.slider.setStepForHandle,     this.slider);
        this.getPosition          = _.bind(this.slider.getPosition,          this.slider);
        this.setPosition          = _.bind(this.slider.setPosition,          this.slider);
        this.getStep              = _.bind(this.slider.getStep,              this.slider);
        this.setStep              = _.bind(this.slider.setStep,              this.slider);
        this.onClose              = _.bind(this.slider.onClose,              this.slider);

        // horizontal slider overrides
        // replace method in slider with our own method, bind to this scope.
        this.slider._dispatchChange       = _.bind(this.slider._dispatchChange, this);
        this.slider._dispatchDragStart    = _.bind(this.slider._dispatchDragStart, this);
        this.slider._dispatchDragStop     = _.bind(this.slider._dispatchDragStop, this);
        this.slider.updateHandlePosition  = _.bind(this.updateHandlePosition, this);
    },

    updateHandlePosition: function($handle, range, position, value) {
        // position = this._enforceRangePosition($handle, position);
        // value    = range.calculateValueForPosition(position);

        var result = this._restrictHandlePosition($handle, range, value);
        $handle.css({'left': result + 'px'});
    },

    // TODO:
    // Revisit - Restricting the UI is not enough.
    // Range will report improper data as the step and position still update
    // on drag even though the UI is not allowed to pass.
    // I think the better place to override this is in _rangeDidChange.
    // Stop updates to the values, and ui will stop updating.

    _restrictHandlePosition: function($handle, range, value) {
        var index = this.slider._getHandleIndex($handle);
        var ranges = this.slider.ranges;
        var values = _.map(ranges, function(range){
            return range.getValue();
        }, this);

        var min = values[index - 1] || 0;
        var max = values[index + 1] || range.getMax();

        var result = value;

        result = Math.max(value, min);
        result = Math.min(result, max);

        console.log(min, max, result);

        return result;
    },

    _enforceRangePosition: function($h, position) {
        var result    = position;
        var index     = this.slider._getHandleIndex($h);
        var positions = this.getPositions();
        var length    = positions.length;

        // get boundaries
        // if index + or - 1 is out of range, set to min or max limit.
        var minBoundary = positions[index - 1] || 0;
        var maxBoundary = positions[index + 1] || 1;

        // Update result
        // Restrict value to left and right boundary values
        result = Math.max(position, minBoundary);
        result = Math.min(result, maxBoundary);

        return result;
    },

    // "Public" methods

    getRange: function() {
        var results         = [];
        var positions       = this.getPosition();
        var availableRanges = this.slider.handles.length - 1;

        var i = 0;
        var len = availableRanges;

        for(i; i < len; i++) {
            var x1 = positions[i];
            var x2 = positions[i+1];

            results.push(Math.abs(x2-x1));
        }
        // }

        return results;
    },

}); // eof HorizontalRangeSlider

// Exports
module.exports = HorizontalRangeSlider;

}); // eof define

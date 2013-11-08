define(function(require, exports, module) {

// Imports

var _                = require('underscore');
var Marionette       = require('marionette');
var HorizontalSlider = require('auf/ui/controls/sliders/horizontal');
var Helpers          = require('auf/utils/helpers');

// Module

// TODO
// - Explore - See what using BB's extend on HorizontalSlider looks like.

// var HorizontalRangeSlider =  Marionette.Controller.extend({
var HorizontalRangeSlider =  HorizontalSlider.extend({

    // Backbone & Marionette overrides

    /**
     * Initialize HorizontalRangeSlider
     *
     * @description HorizontalRangeSlider simply extends a HorizontalSlider
     * performing some overrides of internal HorizontalSlider methods to
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
        this._minRequiredHandles = 2;

        // call super initialize
        // required, the parent initialize does not get called otherwise.
        this.constructor.__super__.initialize.apply(this, arguments);
    },

    // HorizontalSlider overrides

    setPositionAt: function(value, index) {
        value = this._restrictRangePositions(value, index);

        this.constructor.__super__.setPositionAt.call(this, value, index);
    },

    // Helper methods

    _restrictRangePositions: function(value, index) {
        var positions, min, max, result;

        positions = this.getPositions();
        min       = positions[index - 1] || 0;
        max       = positions[index + 1] || 1;
        result    = Helpers.normalizeInt(value, min, max);

        return result;
    },

    // "Public" methods

    getRanges: function() {
        var positions, i, len, results, p1, p2;

        positions = this.getPositions();
        i         = 0;
        len       = positions.length;
        results   = [];

        // not using _.map here because for loop was more clear / convenient
        for(i; i < len; i++) {
            p1 = positions[i];
            p2 = positions[i + 1];

            // skip any range that does not have a second value
            // this is usually the right most range / handle
            if(typeof p2 === 'undefined') {
                continue;
            }

            results.push(Math.abs(p2 - p1));
        }

        return results;
    },

}); // eof HorizontalRangeSlider

// Exports

module.exports = HorizontalRangeSlider;

}); // eof define

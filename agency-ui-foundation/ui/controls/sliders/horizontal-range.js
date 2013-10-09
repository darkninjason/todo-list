define(function(require, exports, module) {

// Imports

var Marionette       = require('marionette');
var _                = require('underscore');
var HorizontalSlider = require('auf/ui/controls/sliders/horizontal');

// Module

// TODO:
// - Add Error, lt handles in opts, causes error.
// - Idea?, handles are distributed evenly by default?
//      - eg |[h1]---[h2]| or |[h1]---[h2]---[h3]|
//      - currently |[h1/2/3]------|
// - Revisit, having to call some _ from slider; not sure it's good.

var HorizontalRangeSlider =  Marionette.Controller.extend({

    // Initialization

    initialize: function(options) {
        _.bindAll(this, '_handleWantsMove');

        this.slider = new HorizontalSlider(options);
        this.slider._handleWantsMove = this._handleWantsMove;

        this.listenTo(this.slider, 'change', this._rangeDidChange);
    },

    _rangeDidChange: function(slider) {
        this.trigger('change', this);
    },

    _handleWantsMove: function($h, offset) {
        var handleIndex = this.slider._getHandleIndex($h);
        var obj         = this.slider.ranges[handleIndex];
        var position    = this.slider._calculatePositionWithRangeAndDelta(obj, offset);

        // TODO:
        // Fix, update this when enforce steps is fixed / refactored.

        if(this.slider.steps) {

            // TODO: dupes code in horizontal.js
            var step = this.slider._calculateStepWithRangeAndPosition(obj, position);
            var currentStep = this.slider.handleSteps[handleIndex];

            if(step !== currentStep) {
                step = this._enforceRangeStep(handleIndex, step);
                this.slider.setStep($h, step);
            }
        } else {
            position = this._enforceRangePosition($h, position);
            this.slider.setPosition($h, position);
        }
    },

    // TODO: Optimization, ternary for performance?
    // - Rename, name could be more explicit

    _enforceRangePosition: function($h, position) {
        var result    = position;
        var index     = this.slider._getHandleIndex($h);
        var positions = this.getPosition();
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

    // TODO:
    // - FIx, update to use _enforceRangePosition
    // - Rename, name could be more explicit

    _enforceRangeStep: function($h, step) {
        var result    = step;
        var index     = this.slider._getHandleIndex($h);
        var steps     = this.slider.getSteps();

        var minStep = steps[index -1] || 0;
        var maxStep = steps[index + 1] || this.slider.steps;

        result = Math.max(step, minStep);
        result = Math.min(result, maxStep);

        return result;
    },

    // "Public" methods

    getRange: function() {
        var results = [];

        var positions          = this.getPosition();
        var availableRanges    = this.slider.handles.length - 1;
        var hasAtLeastOneRange = availableRanges > 0;

        // TODO:
        // Refactor, hslider should error if less-than two handles are passed in.
        // if(hasAtLeastOneRange) {
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

    // Horizontal slider proxies

    // TODO:
    // Improvement, take optional element; return all positions if undefined.
    // - OR, change this to getPositions()
    // - and, getPosition now looks like getPosition($h)
    getPosition: function() {
        return this.slider.getPosition();
    },

    // TODO:
    // - Flag, flag for slider.steps is clunky
    setPosition: function($h, position) {
        position = this._enforceRangePosition($h, position);
        return this.slider.setPosition($h, position);
    },

    getSteps: function() {
        return this.slider.handleSteps;
    },

    setStep: function($h, value) {
        value = this._enforceRangeStep($h, value);
        return this.slider.setStep($h, value);
    },

    // Marionette overrides

    onClose: function() {
        this.slider.close();
    }

}); // eof HorizontalRangeSlider

// Exports
module.exports = HorizontalRangeSlider;

}); // eof define

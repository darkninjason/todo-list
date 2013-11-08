define(function(require, exports, module){

// Imports

var Marionette           = require('marionette');
var _                    = require('underscore');
var RangeManager         = require('auf/ui/managers/range');
var MouseResponder       = require('auf/ui/responders/mouse');
var TouchResponder       = require('auf/ui/responders/touches');

// Module

var HorizontalSlider = Marionette.Controller.extend({

    // Constants

    EVENT_CHANGE:     'change',
    EVENT_DRAG_START: 'drag:start',
    EVENT_DRAG_STOP:  'drag:stop',

    // Properties

    _minRequiredHandles: 1,
    _rangeManagers     : null,
    _mouseResponders   : null,
    _touchResponders   : null,
    _handleOffsets     : [],

    // Backbone & Marionette overrides

    /**
     * Initialize HorizontalSlider
     * @param  {object} options options literal
     * @return {undefined}
     *
     * @example
     * horizontalSlider = new HorizontalSlider(
     *     {
     *         $track            : $('.slider .track'),    // required
     *         $handles          : $('.slider .handle'),   // required
     *         steps             : 10,                     // default 0
     *         snap              : true,                   // default false
     *         acceptsMouse      : true                    // default true
     *         acceptsTouch      : false                   // default false
     *         acceptsOrientation: false                   // default false
     *     }
     * );
     */
    initialize: function(options){
        var hasTrackSetting, hasOneTrack, hasHandleSetting, hasMinHandles;

        this.options = options;
        _.defaults(options, this._getDefaults());

        hasTrackSetting  = options.$track !== null;
        hasOneTrack      = hasTrackSetting && options.$track.length == 1;
        hasHandleSetting = options.$handles !== null;
        hasMinHandles    = hasHandleSetting && options.$handles.length >= this._minRequiredHandles;

        if(!hasOneTrack) {
            throw 'HorizontalSlider requires at least one track element!';
        }
        if(!hasMinHandles) {
            throw 'HorizontalSlider requires at least ' + this._minRequiredHandles + ' handle element(s)!';
        }

        this._rangeManagers = this._initializeRanges(this.options);

        if(this.options.acceptsMouse){
            this._mouseResponders = this._initializeMouse(this.options);
        }
        if(this.options.acceptsTouch){
            this._touchResponders = this._initializeTouch(this.options);
        }
    },

    onClose: function() {
        var controllers;

        function iterator (controller, i, list) {
            if(controller) controller.close();
        }

        controllers = (this._mouseResponders || [])
            .concat(this._touchResponders || [])
            .concat(this._rangeManagers || []);

        _.each(controllers, iterator, this);
    },

    // Override / extend return value here to add additional options
    _getDefaults: function() {
        return {
            $track: null,
            $handles: null,
            steps: 0,
            snap: false,
            acceptsMouse: true,
            acceptsTouch: false
        };
    },

    // Internal initialization

    _initializeRanges: function(options) {
        var $handles, $track;

        function iterator(handle, i, list) {
            var $handle, listener, range;

            $handle  = $(handle);
            listener = _.bind(this.rangeDidChange, this, $handle);
            range    = new RangeManager({
                min: 0,
                max: this._calculateNormalizedMaxPosition($handle, $track)
            });

            this.listenTo(range, 'change', listener);

            return range;
        }

        $handles = options.$handles;
        $track   = options.$track;

        return _.map($handles, iterator, this);
     },

    _initializeMouse: function(options) {
        var ranges;

        function iterator(el, i, list) {
            return new MouseResponder({
                el: $(el),
                mouseDragged: _.bind(this.handleDidReceiveDrag,      this, ranges[i]),
                mouseDown   : _.bind(this.handleDidReceiveDragStart, this, ranges[i]),
                mouseUp     : _.bind(this.handleDidReceiveDragStop,  this, ranges[i])
            });
        }

        ranges = this._rangeManagers;

        return _.map(this.options.$handles, iterator, this);
    },

    _initializeTouch: function(options) {
        var ranges;

        function iterator(el, i, list) {
            return new TouchResponder({
                el: $(el),
                touchMove : _.bind(this.handleDidReceiveDrag,      this, ranges[i]),
                touchStart: _.bind(this.handleDidReceiveDragStart, this, ranges[i]),
                touchEnd  : _.bind(this.handleDidReceiveDragStop,  this, ranges[i])
            });
        }

        ranges = this._rangeManagers;

        return _.map(this.options.$handles, iterator, this);
    },

    // 'Private' helper accessors

    _getElementBounds: function($el) {
        // el is raw dom element
        // returns ClientRect: {'bottom', 'height', 'left', 'right', 'top', 'width'}
        return $el[0].getBoundingClientRect();
    },

    _calculateNormalizedMaxPosition: function($handle, $track) {
        var handleBounds, trackBounds;

        handleBounds = this._getElementBounds($handle);
        trackBounds  = this._getElementBounds($track);

        return Math.abs(trackBounds.width - handleBounds.width);
    },

    _getHandleIndex: function($handle) {
        var $handles, index;

        $handles = this.options.$handles;
        index = $handles.index($handle);

        if(index < 0) {
            throw 'Could not retrieve handle from the currently set $handles option.';
        }

        return index;
    },

    _getRangeManager: function(index) {
        var outofrange;

        outofrange = index > this._rangeManagers.length - 1;

        if(outofrange) {
            throw 'Index out of range, this._rangeManagers[' + index + '], when length is ' + this._rangeManagers.length + '.';
        }

        return this._rangeManagers[index];
    },

    _updateHandlePosition: function($handle, range, position, value) {
        // TODO: Enhancement - ADD support for CSS3 Transitions?
        $handle.css({'left': value + 'px'});
    },

    _updateHandlePositionWithSnap: function($handle, range, position, value) {
        var step, stepDelta;

        step      = this.getStepForHandle($handle);
        stepDelta = range.getMax() / this.options.steps;

        // augment position and value
        value = stepDelta * step;

        // pass in augmented values to original update function
        this._updateHandlePosition($handle, range, position, value);
    },

    // 'Public' Position methods

    calculateMaxPosition: function() {
        var $handles, $track, $handle, range, max;

        function iterator(handle, i, $handles) {
            $handle = $(handle);
            range   = this._getRangeManager(i);
            max     = this._calculateNormalizedMaxPosition($handle, $track);

            range.setMax(max);
        }

        $handles = this.options.$handles;
        $track   = this.options.$track;

        _.each(this.options.$handles, iterator, this);
    },

    getPositionAt: function(index) {
        return this._getRangeManager(index).getPosition();
    },

    getPositions: function() {
        function iter(el, i, list) {
            return this.getPositionAt(i);
        }

        return _.map(this._rangeManagers, iter, this);
    },

    getPositionForHandle: function($handle) {
        var index;

        index = this._getHandleIndex($handle);
        return this.getPositionAt(index);
    },

    setPositionAt: function(value, index) {
        index = index || 0; // default to 0
        this._getRangeManager(index).setPosition(value);
    },

    setPositionForHandle: function(value, $handle) {
        var index;

        index = this._getHandleIndex($handle);
        this.setPositionAt(value, index);
    },

    // Step methods

    getStepAt: function(index) {
        var position;

        position = this.getPositionAt(index);

        // round will round-up if decimal is greater than .5.
        // round will round-down if decimal is less than .5.
        // this should give good reporting of steps based on position.
        return Math.round(this.options.steps * position);
    },

    getSteps: function() {
        function iterator(el, i, list) {
            return this.getStepAt(i);
        }

        return _.map(this._rangeManagers, iterator, this);
    },

    getStepForHandle: function($handle) {
        var index;

        index = this._getHandleIndex($handle);
        return this.getStepAt(index);
    },

    setStepAt: function(value, index) {
        var posiiton, steps;

        steps = this.options.steps;

        // isNaN check handles 0/0 case
        position = value/steps;
        position = isNaN(position) ? 0 : position;

        this.setPositionAt(position, index);
    },

    setStepForHandle: function(value, $handle) {
        var index;

        index = this._getHandleIndex($handle);
        this.setStepAt(value, index);
    },

    // Convenience API

    getPosition: function() {
        return this.getPositionAt(0);
    },

    setPosition: function(value) {
        this.setPositionAt(value, 0);
    },

    getStep: function() {
        return this.getStepAt(0);
    },

    setStep: function(value) {
        this.setStepAt(value, 0);
    },

    // Event delegates

    rangeDidChange: function($handle, range, position, value) {
        if(this.options.snap) {
            this._updateHandlePositionWithSnap($handle, range, position, value);
        }else{
            this._updateHandlePosition($handle, range, position, value);
        }

        this._dispatchChange($handle, position);
    },

    handleDidReceiveDrag: function(range, responder, e) {
        var $handle, index, delta, value;

        e.preventDefault();

        $handle = responder.$el;
        index   = this._getHandleIndex($handle);

        // touch returns array, mouse returns single value.
        // we can use some slight-of-hand to get the correct value.
        // if deltaX()[0] is undefined then
        // return the value of deltaX() only.
        delta = responder.deltaX()[0] || responder.deltaX();
        value = delta + this._handleOffsets[index];

        this.setPositionForHandle(range.calculatePositionForValue(value), $handle);
    },

    handleDidReceiveDragStart: function(range, responder, e) {
        var $handle, index;

        e.preventDefault();

        $handle = responder.$el;
        index   = this._getHandleIndex($handle);

        this._handleOffsets[index] = responder.$el.position().left;
        this._dispatchDragStart(responder.$el, range.getPosition());
    },

    handleDidReceiveDragStop: function(range, responder, e) {
        e.preventDefault();
        this._dispatchDragStop(responder.$el, range.getPosition());
    },

    // Event Dispatchers

    // Event dispatchers should follow this format:
    // this.trigger(EVENT_CONSTANT, sender, [target, [args...]]);
    // Where:
    // - Target is optional if the sender is the target, else required.
    // - Args is also optional and can be any number of args.
    //   - Use args to pass along useful, additional information.
    _dispatchChange: function($handle, position) {
        this.trigger(this.EVENT_CHANGE, this, $handle, position);
    },

    _dispatchDragStart: function($handle, position) {
        this.trigger(this.EVENT_DRAG_START, this, $handle, position);
    },

    _dispatchDragStop: function($handle, position) {
        this.trigger(this.EVENT_DRAG_STOP, this, $handle, position);
    }

}); // eof HorizontalSlider

// Exports
module.exports = HorizontalSlider;

}); // eof define

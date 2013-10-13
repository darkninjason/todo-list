define(function(require, exports, module){
// Imports

var Marionette           = require('marionette');
var _                    = require('underscore');
var RangeManager         = require('auf/ui/managers/range');
var MouseResponder       = require('auf/ui/responders/mouse');
var TouchResponder       = require('auf/ui/responders/touches');
var OrientationResponder = require('auf/ui/responders/orientation');

// Module

var HorizontalSlider = Marionette.Controller.extend({

    // Constants

    EVENT_CHANGE:     'change',
    EVENT_DRAG_START: 'drag:start',
    EVENT_DRAG_STOP:  'drag:stop',

    // Properties

    minRequiredHandles: 1,
    ranges: null,
    mouseResponders: null,
    touchResponders: null,
    orientationResponder: null,
    handleOffsets: [],

    // Defaults

    _defaults: {
        $track: null,
        $handles: null,
        steps: 0,
        snap: false,
        acceptsMouse: true,
        acceptsTouch: false,
        acceptsOrientation: false
    },

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
        _.defaults(options, this._defaults);

        var hasTrackSetting     = options.$track !== null;
        var hasOneTrack         = hasTrackSetting && options.$track.length == 1;
        var hasHandleSetting    = options.$handles !== null;
        var hasAtLeastOneHandle = hasHandleSetting && options.$handles.length >= this.minRequiredHandles;

        if(!hasOneTrack) {
            throw 'HorizontalSlider requires at least one track element!';
        }

        if(!hasAtLeastOneHandle) {
            throw 'HorizontalSlider requires at least ' + this.minRequiredHandles + ' handle element(s)!';
        }

        this.ranges = this._initializeRanges(this.options);

        if(this.options.acceptsMouse){
            this.mouseResponders = this._initializeMouse(this.options);
        }
        if(this.options.acceptsTouch){
            this.touchResponders = this._initializeTouch(this.options);
        }
        if(this.options.acceptsOrientation){
            this.orientationResponder = this._initializeOrientation(this.options);
        }
    },

    onClose: function() {
        function iterator (responder, i, list) {
            if(responder) responder.onClose();
        }

        var responders = this.mouseResponders
            .concat(this.touchResponders || [])
            .concat(this.orientationResponder || []);

        _.each(responders, iterator, this);
    },

    // Internal initialization

    _initializeRanges: function(options) {
        function iterator(handle, i, list) {
            var $handle      = $(handle);
            var handleBounds = handlesBounds[i];
            var listener     = _.bind(this.rangeDidChange, this, $handle);

            var range = new RangeManager({
                min: 0,
                max: trackBounds.width - handleBounds.width
            });

            this.listenTo(range, 'change', listener);

            return range;
        }

        var $handles      = options.$handles;
        var $track        = options.$track;
        var handlesBounds = this._getElementsBounds($handles.toArray());
        var trackBounds   = this._getElementBounds($track[0]);

        return _.map($handles, iterator, this);
     },

    _initializeMouse: function(options) {
        function iterator(el, i, list) {
            return new MouseResponder({
                el: $(el),
                mouseDragged: _.bind(this.handleDidReceiveDrag,      this, ranges[i]),
                mouseDown   : _.bind(this.handleDidReceiveDragStart, this, ranges[i]),
                mouseUp     : _.bind(this.handleDidReceiveDragStop,  this, ranges[i])
            });
        }

        var ranges = this.ranges;

        return _.map(this.options.$handles, iterator, this);
    },

    _initializeTouch: function(options) {
        function iterator(el, i, list) {
            return new TouchResponder({
                el: $(el),
                touchMove : _.bind(this.handleDidReceiveDrag,      this, ranges[i]),
                touchStart: _.bind(this.handleDidReceiveDragStart, this, ranges[i]),
                touchEnd  : _.bind(this.handleDidReceiveDragStop,  this, ranges[i])
            });
        }

        var ranges = this.ranges;

        return _.map(this.options.$handles, iterator, this);
    },

    _initializeOrientation: function(options) {
        return new OrientationResponder({
            portrait : this.didReceiveOrientationChange,
            landscape: this.didReceiveOrientationChange
        });
    },

    // 'Private' helper accessors

    _getElementBounds: function(el) {
        // el is raw dom element
        // returns ClientRect: {'bottom', 'height', 'left', 'right', 'top', 'width'}
        return el.getBoundingClientRect();
    },

    _getElementsBounds: function(elements) {
        // elements is a list of raw dom elements
        // returns multiple ClientRects for list of elements.
        return _.map(elements, this._getElementBounds, this);
    },

    _getHandleIndex: function($handle) {
        var $handles = this.options.$handles;
        var index = $handles.index($handle);

        if(index < 0) {
            throw 'Could not retrieve handle from the currently set $handles option.';
        }

        return index;
    },

    _getRangeManager: function(index) {
        var outofrange = index > this.ranges.length - 1;

        if(outofrange) {
            throw 'Index out of range, this.ranges[' + index + '], when length is ' + this.ranges.length + '.';
        }

        return this.ranges[index];
    },

    _getRangeValues: function() {
        function iterator(range, i, list) {
            return range.getValue();
        }

         return _.map(this.ranges, iterator, this);
    },

    _updateHandlePosition: function($handle, range, position, value) {
        // TODO: Enhancement - ADD support for CSS3 Transitions?
        $handle.css({'left': value + 'px'});
    },

    _updateHandlePositionWithSnap: function($handle, range, position, value) {
        var step      = this.getStepForHandle($handle);
        var stepDelta = range.getMax() / this.options.steps;

        // augment position and value
        value = stepDelta * step;

        // pass in augmented values to original update function
        this._updateHandlePosition($handle, range, position, value);
    },

    // 'Public' Position methods

    getPositionAt: function(index) {
        return this._getRangeManager(index).getPosition();
    },

    getPositions: function() {
        function iter(el, i, list) {
            return this.getPositionAt(i);
        }

        return _.map(this.ranges, iter, this);
    },

    getPositionForHandle: function($handle) {
        var index = this._getHandleIndex($handle);
        return this.getPositionAt(index);
    },

    setPositionAt: function(value, index) {
        index = index || 0; // default to 0
        this._getRangeManager(index).setPosition(value);
    },

    setPositionForHandle: function(value, $handle) {
        var index = this._getHandleIndex($handle);
        this.setPositionAt(value, index);
    },

    // Step methods

    getStepAt: function(index) {
        var position = this.getPositionAt(index);

        // round will round-up if decimal is greater than .5.
        // round will round-down if decimal is less than .5.
        // this should give good reporting of steps based on position.
        return Math.round(this.options.steps * position);
    },

    getSteps: function() {
        function iter(el, i, list) {
            return this.getStepAt(i);
        }

        return _.map(this.ranges, iter, this);
    },

    getStepForHandle: function($handle) {
        var index = this._getHandleIndex($handle);
        return this.getStepAt(index);
    },

    setStepAt: function(value, index) {
        var posiiton;
        var steps = this.options.steps;

        // isNaN check handles 0/0 case
        position = value/steps;
        position = isNaN(position) ? 0 : position;

        this.setPositionAt(position, index);
    },

    setStepForHandle: function(value, $handle) {
        var index = this._getHandleIndex($handle);
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
        e.preventDefault();

        var $handle = responder.$el;
        var index   = this._getHandleIndex($handle);

        // touch returns array, mouse returns single value.
        // we can use some slight-of-hand to get the correct value.
        // if deltaX()[0] is undefined then
        // return the value of deltaX() only.
        var delta = responder.deltaX()[0] || responder.deltaX();
        var value = delta + this.handleOffsets[index];

        this.setPositionForHandle(range.calculatePositionForValue(value), $handle);
    },

    handleDidReceiveDragStart: function(range, responder, e) {
        e.preventDefault();

        var $handle = responder.$el;
        var index   = this._getHandleIndex($handle);

        this.handleOffsets[index] = responder.$el.position().left;

        this._dispatchDragStart(responder.$el, range.getPosition());
    },

    handleDidReceiveDragStop: function(range, responder, e) {
        e.preventDefault();
        this._dispatchDragStop(responder.$el, range.getPosition());
    },

    didReceiveOrientationChange: function(responder, e) {
        function iterator(range, i, list) {
            // setMax causes range to dispatch change.
            // that should be suffient to also update this
            // component should the position change.
            range.setMax(trackBounds.width - handleBounds[i].width);
        }

        var $track        = this.options.$track;
        var handlesBounds = this._getElementsBounds($handles.toArray());
        var trackBounds   = this._getElementBounds($track[0]);

        _.each(this.ranges, iterator, this);
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

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
        var hasAtLeastOneHandle = hasHandleSetting && options.$handles.length > 0;

        if(!hasOneTrack) {
            throw 'HorizontalSlider requires at least one track element!';
        }

        if(!hasAtLeastOneHandle) {
            throw 'HorizontalSlider requires at least one handle element!';
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
            var listener     = _.bind(this._rangeDidChange, this, $handle);

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
                mouseDragged: _.bind(this._handleDidReceiveDrag,      this, ranges[i]),
                mouseDown   : _.bind(this._handleDidRecieveDragStart, this, ranges[i]),
                mouseUp     : _.bind(this._handleDidRecieveDragStop,  this, ranges[i])
            });
        }

        var ranges = this.ranges;

        return _.map(this.options.$handles, iterator, this);
    },

    _initializeTouch: function(options) {
        function iterator(el, i, list) {
            return new TouchResponder({
                el: $(el),
                touchMove : _.bind(this._handleDidReceiveDrag,      this, ranges[i]),
                touchStart: _.bind(this._handleDidRecieveDragStart, this, ranges[i]),
                touchEnd  : _.bind(this._handleDidRecieveDragStop,  this, ranges[i])
            });
        }

        var ranges = this.ranges;

        return _.map(this.options.$handles, iterator, this);
    },

    _initializeOrientation: function(options) {
        return new OrientationResponder({
            portrait : this._didReceiveOrientationChange,
            landscape: this._didReceiveOrientationChange
        });
    },

    _didReceiveOrientationChange: function(responder, e) {
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


    // 'Protected' methods

    _updateHandlePosition: function($handle, range, position, value) {
        var left = value;
        $handle.css({'left': left + 'px'});
    },

    _updateHandlePositionWithSnap: function($handle, range, position, value) {
        var step      = this.getHandleStep($handle);
        var stepDelta = range.getMax() / this.options.steps;
        var left      = stepDelta * step;

        $handle.css({'left': left + 'px'});
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
        return this.options.$handles.index($handle);
    },

    _getRangeManager: function(index) {
        var range = this.ranges[index];

        if(typeof range == 'undefined') {
            throw 'Index out of range, this.ranges[' + index + '], when length is ' + this.ranges.length + '.';
        }

        return range;
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

    getHandlePosition: function($handle) {
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

    getHandleStep: function($handle) {
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

    _rangeDidChange: function($handle, range, position, value) {
        if(this.options.snap) {
            this._updateHandlePositionWithSnap(
                $handle, range, position, value);

        }else{
            this._updateHandlePosition(
                $handle, range, position, value);
        }

        this._dispatchChange($handle, position);
    },

    _handleDidReceiveDrag: function(range, responder, e) {
        e.preventDefault();

        var $handle = responder.$el;
        var index   = this._getHandleIndex($handle);
        var delta   = responder.deltaX()[0] || responder.deltaX();
        var value   = delta + this.handleOffsets[index];

        this.setPositionForHandle(range.calculatePositionForValue(value), $handle);
    },

    _handleDidRecieveDragStart: function(range, responder, e) {
        e.preventDefault();

        var $handle = responder.$el;
        var index   = this._getHandleIndex($handle);

        this.handleOffsets[index] = responder.$el.position().left;

        this._dispatchDragStart(responder.$el, range.getPosition());
    },

    _handleDidRecieveDragStop: function(range, responder, e) {
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

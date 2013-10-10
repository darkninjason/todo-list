define(function(require, exports, module){
// Imports

var Marionette           = require('marionette');
var _                    = require('underscore');
var MouseResponder       = require('auf/ui/responders/mouse');
var TouchResponder       = require('auf/ui/responders/touches');
var OrientationResponder = require('auf/ui/responders/orientation');
var RangeManager         = require('auf/ui/managers/range');

// Module

// TODO:
// - Options
//   - $track             // required
//   - $handles           // required (at least 1)
//   - acceptsMouse       // default true
//   - acceptsTouch       // default false
//   - acceptsKeys        // default false
//   - acceptsOrientation // default false
//   - steps              // number of steps, default is 0
//   - snap               // should view 'snap' to steps, default false
//
// - Public API
//   - getPositionAt()
//   - getPositions()
//   - getHandlePosition()
//   - setPositionAt()
//   - setPositions()
//   - setHandlePosition()
//   - setHandlePositions()
//   - getStepAt()
//   - getSteps()
//   - getHandleStep()
//   - setStepAt()
//   - setSteps()
//   - setHandleStep()
//   - setHandleSteps()
//
// - Events
//   - change
//   - drag: start
//   - drag: stop
//
// - Interaction support
//   - Mouse
//   - Touch
//   - Device Orientation
//   - Keys (arrows, depends on slider orientation)
//
// Tasks
// - Implement Touch Handling
// - Implement Key Handling
// - Implement Orientation Handling
//
// Thoughts
// - Handles take starting position?
// - Change event reports steps, positions, target step, target position?

var HorizontalSlider = Marionette.Controller.extend({

    // Constants

    EVENT_CHANGE:     'change',
    EVENT_DRAG_START: 'drag:start',
    EVENT_DRAG_STOP:   'drag:stop;',

    ranges: null,
    mouseResponders: null,
    handleOffset: 0,

    // Defaults

    _defaults: {
        $track: null,
        $handles: null,
        steps: 0,
        snap: false,
        acceptsMouse: true,
        acceptsTouch: false,
        acceptsKeys: false,
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
     *         acceptsKeys       : false                   // default false
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
    },

    onClose: function() {
        // TODO: Close all responders here?
    },

    // Internal initialization

    _initializeRanges: function(options) {
        var ranges = this._getNormalizedRanges(
            options.$track,
            options.$handles
        );

        var id, range, $handle, listener;
        var i   = 0;
        var len = ranges.length;

        for(i; i < len; i++) {
            id       = i;
            range    = ranges[i];
            $handle  = options.$handles.eq(i);
            listener = _.bind(this._rangeDidChange, this, $handle);

            // attach listener to range: change
            this.listenTo(range, 'change', listener);
        }

        return ranges;
    },

    _getNormalizedRanges: function($track, $handles) {
        var max;
        var min           = 0;
        var results       = [];
        var trackBounds   = this._getElementBounds($track[0]);
        var handlesBounds = this._getElementsBounds($handles.toArray());
        var i             = 0;
        var len           = handlesBounds.length;

        for(i; i < len; i++) {
            max = trackBounds.width - handlesBounds[i].width;
            results.push(new RangeManager({min:min, max:max}));
        }

        return results;
     },

    _initializeMouse: function(options) {
        var range, mouseDragged, mouseDown, mouseUp, responder;
        var $handles = options.$handles;
        var ranges   = this.ranges;
        var i        = 0;
        var len      = $handles.length;
        var results  = [];

        for(i; i < len; i++) {
            range        = ranges[i];
            mouseDragged = _.bind(this._handleDidReceiveMouseDrag, this, range);
            mouseDown    = _.bind(this._handleDidRecieveMouseDown, this, range);
            mouseUp      = _.bind(this._handleDidRecieveMouseUp, this, range);

            responder = new MouseResponder({
                el: $handles.eq(i),
                mouseDragged: mouseDragged,
                mouseDown: mouseDown,
                mouseUp: mouseUp
            });

            results.push(responder);

        }

        return results;
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
        // TODO: IE Support, may need polyfill later.
        return el.getBoundingClientRect();
    },

    _getElementsBounds: function(elements) {
        // elements is a list of raw dom elements
        // returns multiple ClientRects for list of elements.

        var results = [];
        var i = 0;
        var len = elements.length;

        for(i; i < len; i++){
            results.push(this._getElementBounds(elements[i]));
        }

        return results;
    },

    _getHandleIndex: function($handle) {
        return this.options.$handles.index($handle);
    },

    _getRange: function(index) {
        var range = this.ranges[index];

        if(typeof range == 'undefined') {
            throw 'Index out of range, this.ranges[' + index + '], when length is ' + this.ranges.length + '.';
        }

        return range;
    },

    // 'Public' Position methods

    getPosition: function() {
        return this.getPositionAt(0);
    },

    getPositionAt: function(index) {
        return this._getRange(index).getPosition();
    },

    getPositions: function() {
        var results = [];
        var ranges  = this.ranges;
        var i       = 0;
        var len     = ranges.length;

        for(i; i < len; i++) {
            results.push(this.getPositionAt(i));
        }

        return results;
    },

    getHandlePosition: function($handle) {
        var index = this._getHandleIndex($handle);
        return this.getPositionAt(index);
    },

    setPosition: function(value) {
        this.setPositionAt(value, 0);
    },

    setPositionAt: function(value, index) {
        index = index || 0; // default to 0
        this._getRange(index).setPosition(value);
    },

    setHandlePosition: function(value, $handle) {
        var index = this._getHandleIndex($handle);
        this.setPositionAt(value, index);
    },

    // Step methods
    getStep: function() {
        return this.getStepAt(0);
    },

    getStepAt: function(index) {
        var position = this.getPositionAt(index);

        // round will round-up if decimal is .5 or higher.
        // this should give good reporting of steps
        return Math.round(this.options.steps * position);
    },

    getSteps: function() {
        var results = [];
        var ranges  = this.ranges;
        var i       = 0;
        var len     = ranges.length;

        for(i; i < len; i++) {
            results.push(this.getStepAt(i));
        }

        return results;
    },

    getHandleStep: function($handle) {
        var index = this._getHandleIndex($handle);
        return this.getStepAt(index);
    },

    setStep: function(value) {
        this.setStepAt(value, 0);
    },

    setStepAt: function(value, index) {
        var posiiton;
        var steps = this.options.steps;

        // isNaN check handles 0/0 case
        position = value/steps;
        position = isNaN(position) ? 0 : position;

        this.setPositionAt(position, index);
    },

    setHandleStep: function(value, $handle) {
        var index = this._getHandleIndex($handle);
        this.setStepAt(value, index);
    },

    // Event delegates

    _rangeDidChange: function($handle, range, position, value) {
        if(this.options.snap) {
            this._updateHandlePositionWithSnap(
                $handle, range, position, value);

        }else{
            this._updateHandlePosition(
                $handle, range, position, value
            );
        }

        this._dispatchChange($handle, position);
    },

    _handleDidReceiveMouseDrag: function(range, responder, e) {
        e.preventDefault();

        var delta   = responder.deltaX();
        var $handle = responder.$el;
        var value   = delta + this.handleOffset;

        range.setValue(value);
    },

    _handleDidRecieveMouseDown: function(range, responder, e) {
        e.preventDefault();
        this.handleOffset = responder.$el.position().left;

        this._dispatchDragStart(responder.$el, range.getPosition());
    },

    _handleDidRecieveMouseUp: function(range, responder, e) {
        e.preventDefault();
        this.handleOffset = responder.$el.position().left;

        this._dispatchDragStop(responder.$el, range.getPosition());
    },

    // Event Dispatchers

    // TODO: possibly pass in target, and related data
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
